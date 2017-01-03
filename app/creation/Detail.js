import {StyleSheet, View, Text, Dimensions, TouchableOpacity,
    ListView, Image, TextInput, Modal, AlertIOS} from 'react-native';
import React, {Component} from 'react';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

import config from '../common/config';
import request from '../common/request';
import User from '../account/User';

export default class Detail extends Component {
    constructor(props) {
        super(props);
        let data = this.props.data;
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            data: data,
            rate: 1,
            muted: false,
            resizeMode: 'contain',
            repeat: false,

            dataSource: ds.cloneWithRows([]),

            animationType: '',
            isLike: false,
            modalVisible: false,
            isSending: false,
            content: '',

            progress: 0
        }
    }

    render() {
        let data = this.props.data;

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
                        <Image style={styles.comments_avatar} source={{uri: data.author.avatar}}/>
                    </TouchableOpacity>
                    <View style={styles.comment_desc_box}>
                        <Text style={styles.comments_nickname} onPress={this._gotoView.bind(this)}>
                            {data.author.nickname}
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
                          style={{marginBottom: 60}}
                />
                <Modal animationType={'fade'} visible={this.state.modalVisible}
                       onRequestClose={() => {this._setModalVisible(false)}}>
                    <View style={styles.model_container}>
                        <Icon onPress={this._closeModal.bind(this)} name="ios-close-outline"
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
                        <Button style={styles.submit_button} onPress={this._submit.bind(this)}>
                            提交留言
                        </Button>
                    </View>
                </Modal>
            </View>
        );
    }

    componentDidMount() {
        this._fetchData();
    }

    _renderHeader(data) {
        return (
            <View style={styles.comments_info_box}>
                <View style={styles.item_desc_container}>
                    <Text style={styles.item_title} numberOfLines={2}>
                        苹果MacBook Pro 13.3英寸笔记本电脑 深空灰色(Core i5处理器/256G SSD闪存)
                    </Text>
                    <View style={[styles.item_state, styles.item_desc_margin]}>
                        <Text style={styles.item_text_font}>
                            总需:1000人次
                        </Text>
                        <Text style={styles.item_text_font}>剩余人次:900</Text>
                    </View>
                    <Progress.Bar style={styles.item_desc_margin} progress={0.1} height={3} width={355} color={'#ee735c'}/>
                </View>
                <View style={styles.item_comments}>
                    <View style={[styles.item_box, styles.item_border_center]}>
                        <Icon style={[styles.item_icon, this.state.isLike ? styles.item_like_color : null]}
                              size={28} name={this.state.isLike ? "ios-heart" : "ios-heart-outline"}
                              onPress={this._like.bind(this, true)}/>
                        <Text style={styles.item_text} onPress={this._like.bind(this, true)}>收藏</Text>
                    </View>
                    <View style={styles.item_box}>
                        <Icon style={styles.item_icon} name="ios-chatboxes-outline" size={28}
                              onPress={this._focus.bind(this, true)}/>
                        <Text style={styles.item_text} onPress={this._focus.bind(this, true)}>留言</Text>
                    </View>
                </View>
                <View style={styles.comments_area}>
                    <Text style={styles.comments_area_title}>留言</Text>
                </View>
            </View>
        );
    }

    _renderItem(row) {
        return (
            <View style={styles.comments_reply_box} key={row._id}>
                <Image style={styles.comments_reply_avatar} source={{uri: row.replyBy.avatar}}/>
                <View style={styles.comment_reply_desc_box}>
                    <Text style={styles.comments_reply_nickname}>{row.replyBy.nickname}</Text>
                    <Text style={styles.comments_reply_content}>{row.content}</Text>
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
        let url = config.api.base + config.api.comment;

        request.get(url, {
            id: 124,
            accessToken: '123'
        }).then(function (data) {
            if (data && data.success) {
                let comments = data.data;
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

    _like() {
        this.setState({
            isLike: !this.state.isLike
        });
    }

    _focus() {
        this._setModelVisible(true);
    }

    _closeModal() {
        this._setModelVisible(false);
    }

    _setIsLike(isLike) {
        this.setState({
            isLike: isLike
        })
    }

    _setModelVisible(isVisible) {
        this.setState({
            modalVisible: isVisible
        })
    }

    _submit() {
        let me = this;

        if (!this.state.content) {
            return AlertIOS.alert('留言不能为空!');
        }

        if (this.state.isSending) {
            return AlertIOS.alert('正在评论中!');
        }

        this.setState({
            isSending: true
        }, function () {
            var body = {
                accessToken: 'abc',
                creation: '1323',
                content: me.state.content
            }

            let url = config.api.base + config.api.comment;
            request.post(url, body).then(function (data) {
                if (data && data.success) {
                    //TODO:更新列表

                    me.setState({
                        isSending: false,
                        content: ''
                        //TODO:还有其他值需要设置
                    });

                    me._setModelVisible(false);
                }
            }).catch((error) => {
                console.log(error);
                me.setState({
                    isSending: false
                    //TODO:还有其他值需要设置
                });
                me._setModelVisible(false);
                AlertIOS.alert('留言失败,请稍后重试!');
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
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: "#666",
        borderBottomWidth: 1,
        borderBottomColor: "#666"
    },
    item_border_center: {
        borderRightWidth: 1,
        borderRightColor: '#666'
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
    }
});