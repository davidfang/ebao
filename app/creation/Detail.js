import {StyleSheet, View, Text, Dimensions, TouchableOpacity, ListView, Image, TextInput, Modal, AlertIOS,
    AsyncStorage} from 'react-native';
import React, {Component} from 'react';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';
import PubSub from 'pubsub-js';
import User from '../account/User';
import config from '../common/config';
import request from '../common/request';
import Service from '../common/service';

export default class Detail extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        let isUp = false;
        let comments = this.props.data.info.good.comments;
        if (comments && comments.length) {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].commentator == this.props.userId) {
                    isUp = Boolean(comments[i].isUp);
                    break;
                }
            }
        }

        this.state = {
            data: this.props.data,

            comments: [],
            dataSource: ds.cloneWithRows([]),

            commentModalVisible: false,
            cartModalVisible: false,
            isUp: isUp,
            isSending: false,
            content: '',

            progress: 0
        }
    }

    render() {
        let data = this.state.data;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.header_back_box} onPress={this._goBack.bind(this)}>
                        <Icon style={styles.back_icon} name="ios-arrow-back"/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.header_title} numberOfLines={1}>宝贝详情</Text>
                </View>
                <View style={styles.comments_author_box}>
                    <TouchableOpacity onPress={this._gotoView.bind(this)}>
                        <Image style={styles.comments_avatar} source={{uri: 'http://dummyimage.com/640X640/86f279)'}}/>
                    </TouchableOpacity>
                    <View style={styles.comment_desc_box}>
                        <Text style={styles.comments_nickname} onPress={this._gotoView.bind(this)}>
                            {data.info.user.username}
                        </Text>
                        <Text style={styles.comments_title}>3天前</Text>
                    </View>
                </View>
                <View style={styles.item_image}>
                    <Image style={styles.item_thumb} source={require('../../assets/images/creation/list_item.jpg')}/>
                </View>
                <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                          automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                          renderRow={(rowData) => this._renderItem(rowData)}
                          renderHeader={this._renderHeader.bind(this, data)}
                          style={styles.margin_bottom}
                />
                <Modal animationType={'fade'} visible={this.state.commentModalVisible}
                       onRequestClose={() => {this.setState({commentModalVisible: false})}}>
                    <View style={styles.model_container}>
                        <Icon onPress={() => {this.setState({commentModalVisible: false})}} name="ios-close-outline"
                              style={styles.modal_close_icon} />
                        <View style={styles.comments_box}>
                            <View style={styles.comments_item}>
                                <TextInput placeholder="敢不敢留一个!"
                                           style={styles.comments_item_content}
                                           multiline={true}
                                           onChangeText={(text) => this.setState({
                                               content: text
                                           })}
                                           defaultValue={this.state.content}/>
                            </View>
                        </View>
                        {
                            (this.state.content && !this.state.isSending) ?
                                <Button style={styles.submit_button} onPress={this._submit.bind(this)}>
                                    提交留言
                                </Button> :
                                <Button style={styles.submit_button_disable}>
                                    提交留言
                                </Button>
                        }
                    </View>
                </Modal>
            </View>
        );
    }

    componentDidMount() {
        let me = this;
        this._fetchData();
        PubSub.subscribe('update_comments', function () {
            me._fetchData();
        });
    }

    _renderHeader(data) {
        return (
            <View style={styles.comments_info_box}>
                <View style={styles.item_desc_container}>
                    <Text style={styles.item_title}>
                        {data.info.good.desc}
                    </Text>
                    <View style={[styles.item_state, styles.item_desc_margin]}>
                        <Text style={styles.item_text_font}>
                            总需:{data.info.good.price}份数
                        </Text>
                        <Text style={styles.item_text_font}>剩余份数:{data.info.good.price}</Text>
                    </View>
                    <Progress.Bar style={styles.item_desc_margin} progress={0.1} height={3} width={355} color={'#ee735c'}/>
                </View>
                <View style={styles.item_comments}>
                    <View style={[styles.item_box, styles.item_box_large, styles.item_border_right]}>
                        <Icon style={styles.item_icon} size={28} name="ios-cart-outline"
                              onPress={this._addToCart.bind(this)}/>
                        <Text style={styles.item_text} onPress={this._addToCart.bind(this)}>加入购物车</Text>
                    </View>
                    <View style={[styles.item_box, styles.item_box_small]}>
                        <Icon style={[styles.item_icon, this.state.isUp ? styles.item_like_color : null]}
                              size={28} name={this.state.isUp ? "ios-heart" : "ios-heart-outline"}
                              onPress={this._up.bind(this)}/>
                        <Text style={styles.item_text} onPress={this._up.bind(this)}>收藏</Text>
                    </View>
                    <View style={[styles.item_box, styles.item_box_small, styles.item_border_left]}>
                        <Icon style={styles.item_icon} name="ios-chatboxes-outline" size={28}
                              onPress={() => {this.setState({commentModalVisible: true})}}/>
                        <Text style={styles.item_text} onPress={() => {this.setState({commentModalVisible: true})}}>留言</Text>
                    </View>
                </View>
                {
                    this.state.comments.length > 0 ?
                        <View style={styles.comments_area}>
                            <Text style={styles.comments_area_title}>留言</Text>
                        </View> :
                        null
                }
            </View>
        );
    }

    _renderItem(row) {
        return (
            <View style={styles.comments_reply_box} key={row._id}>
                <Image style={styles.comments_reply_avatar} source={{uri: 'http://dummyimage.com/640X640/86f279)'}}/>
                <View style={styles.comment_reply_desc_box}>
                    <Text style={styles.comments_reply_nickname}>{row.user.name}</Text>
                    <Text style={styles.comments_reply_content}>{row.content.body}</Text>
                </View>
            </View>
        );
    }

    _goBack() {
        const {navigator, data} = this.props;

        if (navigator) {
            navigator.pop();
            //发布页面push Detail页面时带上此回调,目的是goBack后清空Form表单
            data && data.resetCallback && data.resetCallback();
        }
    }

    _gotoView() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.push({
                name: 'user',
                component: User
            });
        }
    }

    _fetchData() {
        let me = this;
        request.get(config.api.host + config.api.comment.getAllByGoodId, {
            goodId: me.state.data.info.good._id
        }).then((data) => {
            if (data && data.status) {
                let comments = data.result;
                if (comments && comments.length > 0) {
                    me.setState({
                        comments: comments,
                        dataSource: me.state.dataSource.cloneWithRows(comments)
                    });
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    _addToCart() {
        let me = this;
        let user = null

        AsyncStorage.getItem('user').then((userJson) => {
            user = JSON.parse(userJson);
            return request.get(config.api.host + config.api.cart.getByUserIdAndGoodId, {
                userId: user._id,
                goodId: me.state.data.info.good._id
            });
        }).then((data) => {
            if (data && data.status) {
                if (data.result.count > 0) {
                    Service.showToast('已在您的购物车中,请确认购买份数');
                } else {
                    request.post(config.api.host + config.api.cart.update, {
                        count: 1,
                        userId: user._id,
                        goodId: me.state.data.info.good._id
                    }).then((data) => {
                        if (data && data.status) {
                            Service.showToast('已添加到您的购物车');
                            PubSub.publish('update_carts');
                        } else {
                            Service.showToast('网络出错,请稍后重试');
                        }
                    }).catch((error) => {
                        Service.showToast('网络出错,请稍后重试');
                    });
                }
            } else if (data && !data.status && !data.result) {
                request.put(config.api.host + config.api.cart.add, {
                    count: 1,
                    userId: user._id,
                    goodId: me.state.data.info.good._id
                }).then((data) => {
                    if (data && data.status) {
                        Service.showToast('已添加到您的购物车');
                        PubSub.publish('update_carts');
                    } else {
                        Service.showToast('网络出错,请稍后重试');
                    }
                }).catch((error) => {
                    Service.showToast('网络出错,请稍后重试');
                });
            }
        })
    }

    _up() {
        let me = this;
        let user = null;
        this.setState({
            isUp: !this.state.isUp
        }, function () {
            AsyncStorage.getItem('user').then((userJson) => {
                user = JSON.parse(userJson);
                return request.get(config.api.host + config.api.comment.getByUserIdAndGoodId, {
                    userId: user._id,
                    goodId: me.state.data.info.good._id
                });
            }).then((data) => {
                if (data && data.status) {
                    request.post(config.api.host + config.api.comment.update, {
                        isUp: me.state.isUp,
                        userId: user._id,
                        goodId: me.state.data.info.good._id
                    }).then((data) => {
                        if (data && data.status) {
                            if (me.state.isUp) {
                                Service.showToast('收藏成功');
                            } else {
                                Service.showToast('取消成功');
                            }
                        }
                    });
                } else if (data && !data.status && !data.result) {
                    request.put(config.api.host + config.api.comment.add, {
                        isUp: me.state.isUp,
                        content: me.state.content,
                        userId: user._id,
                        goodId: me.state.data.info.good._id
                    }).then((data) => {
                        if (data && data.status) {
                            Service.showToast('收藏成功');
                        }
                    });
                }
            })
        });
    }

    _submit() {
        let me = this;

        this.setState({
            isSending: true
        }, function () {
            AsyncStorage.getItem('user').then((userJson) => {
                user = JSON.parse(userJson);
                return request.get(config.api.host + config.api.comment.getByUserIdAndGoodId, {
                    userId: user._id,
                    goodId: me.state.data.info.good._id
                });
            }).then((data) => {
                if (data && data.status) {
                    request.post(config.api.host + config.api.comment.update, {
                        isUp: me.state.isUp,
                        content: me.state.content,
                        userId: user._id,
                        goodId: me.state.data.info.good._id
                    }).then((data) => {
                        if (data && data.status) {
                            me.setState({
                                isSending: false,
                                content: '',
                                commentModalVisible: false
                            }, function () {
                                Service.showToast('评论成功');
                                PubSub.publish('update_comments');
                            });
                        }
                    }).catch((error) => {
                        me.setState({
                            isSending: false,
                            commentModalVisible: false
                        });
                        AlertIOS.alert('留言失败,请稍后重试!');
                    });
                } else if (data && !data.status && !data.result) {
                    request.put(config.api.host + config.api.comment.add, {
                        isUp: me.state.isUp,
                        content: me.state.content,
                        userId: user._id,
                        goodId: me.state.data.info.good._id
                    }).then((data) => {
                        if (data && data.status) {
                            me.setState({
                                isSending: false,
                                content: '',
                                commentModalVisible: false
                            }, function () {
                                Service.showToast('评论成功');
                            });
                        }
                    }).catch((error) => {
                        me.setState({
                            isSending: false,
                            content: '',
                            commentModalVisible: false
                        }, function () {
                            AlertIOS.alert('留言失败,请稍后重试!');
                        });
                    });
                }
            })
        })
    }

    _getProgress(offset) {
        var progress = this.state.progress + offset;
        return Math.sin(progress % Math.PI) % 1;
    }
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    margin_bottom: {
        marginBottom: 50
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 64,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff'
    },
    header_back_box: {
        position: 'absolute',
        left: 12,
        top: 32,
        width: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    header_title: {
        width: width - 120,
        textAlign: 'center',
        fontSize: 16
    },
    back_icon: {
        color: '#999',
        fontSize: 20,
        marginRight: 5
    },
    back_text: {
        color: '#999',
        fontSize: 16,
    },
    item_image: {
        width: width,
    },
    item_thumb: {
        width: width,
        height: 250,
        resizeMode: 'contain'
    },
    item_desc_container: {
        marginLeft: 10,
        marginRight: 10

    },
    item_title: {
        fontSize: 18,
        fontWeight: '500'
    },
    item_desc_margin: {
        marginTop: 10
    },
    item_state: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item_text_font: {
        fontSize: 16
    },
    item_comments: {
        flexDirection: 'row',
        width: width,
    },
    item_box: {
        padding: 10,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: "#666",
        borderBottomWidth: 1,
        borderBottomColor: "#666"
    },
    item_box_large: {
        flex: 3
    },
    item_box_small: {
        flex: 2
    },
    item_border_right: {
        borderRightWidth: 1,
        borderRightColor: '#666'
    },
    item_border_left: {
        borderLeftWidth: 1,
        borderLeftColor: '#666'
    },
    item_text: {
        fontSize: 18,
        marginLeft: 10,
        color: '#333'
    },
    item_icon: {
        fontSize: 22,
        color: '#333'
    },
    item_like_color: {
        color: '#ee735c'
    },
    comments_info_box: {
        width: width,
    },
    comments_author_box: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    comments_avatar: {
        width: 40,
        height: 40,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 20
    },
    comment_desc_box: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 10
    },
    comments_nickname: {
        fontSize: 16
    },
    comments_title: {
        fontSize: 16,
        color: '#666'
    },
    comments_reply_box: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    comments_reply_avatar: {
        width: 40,
        height: 40,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 20
    },
    comments_reply_nickname: {
        color: '#666'
    },
    comments_reply_content: {
        width: width - 65
    },
    comments_box: {
        marginTop: 10,
        marginBottom: 10,
        padding: 9,
        width: width
    },
    comments_item_content: {
        paddingLeft: 2,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        fontSize: 14,
        height: 80
    },
    comments_area: {
        width: width,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    comments_area_title: {
        fontSize: 18,
        fontWeight: '600'
    },
    model_container: {
        flex: 1,
        paddingTop: 45,
        backgroundColor: '#fff'
    },
    modal_close_icon: {
        alignSelf: 'center',
        fontSize: 30,
        color: '#ee753c'
    },
    submit_button: {
        width: width - 20,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 4,
        color: '#ee735c',
        fontSize: 18
    },
    submit_button_disable: {
        width: width - 20,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#666',
        borderRadius: 4,
        color: '#666',
        fontSize: 18
    }
});