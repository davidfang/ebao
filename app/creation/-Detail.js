import {StyleSheet, View, Text, Dimensions, TouchableOpacity,
    ListView, Image, TextInput, Modal, AlertIOS} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../common/config';
import request from '../common/request';
import Button from 'react-native-button';

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
            modalVisible: false,
            isSending: false,
            content: ''
        }
    }

    render() {
        let data = this.props.data;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.pop_box} onPress={this._goBack.bind(this)}>
                        <Icon style={styles.back_icon} name="ios-arrow-back"/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.header_title} numberOfLines={1}>宝贝详情</Text>
                </View>
                <View style={styles.item_image}>
                    <Image style={styles.item_thumb} source={require('../../assets/images/creation/list_item.jpg')}/>
                </View>
                <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                          automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                          renderRow={(rowData) => this._renderItem(rowData)}
                          renderHeader={this._renderHeader.bind(this, data)}
                />
                <Modal animationType={'fade'} visible={this.state.modalVisible}
                       onRequestClose={() => {this._setModalVisible(false)}}>
                    <View style={styles.model_container}>
                        <Icon onPress={this._closeModal.bind(this)} name="ios-close-outline"
                              style={styles.modal_close_icon} />
                        <View style={styles.comments_box}>
                            <View style={styles.comments_item}>
                                <TextInput placeholder="敢不敢评论一个!"
                                           style={styles.comments_item_content}
                                           multiline={true}
                                           onChangeText={(text) => this.setState({
                                               content: text
                                           })}
                                           defaultValue={this.state.content}/>
                            </View>
                        </View>
                        <Button style={styles.submit_button} onPress={this._submit.bind(this)}>
                            提交评论
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
                <View style={styles.comments_author_box}>
                    <Image style={styles.comments_avatar} source={{uri: data.author.avatar}}/>
                    <View style={styles.comment_desc_box}>
                        <Text style={styles.comments_nickname}>{data.author.nickname}</Text>
                        <Text style={styles.comments_title}>{data.title}</Text>
                    </View>
                </View>
                <View style={styles.comments_box}>
                    <View style={styles.comments_item}>
                        <TextInput placeholder="敢不敢评论一个!"
                                   style={styles.comments_item_content}
                                   multiline={true} onFocus={this._focus.bind(this)}/>
                    </View>
                </View>
                <View style={styles.comments_area}>
                    <Text style={styles.comments_area_title}>精彩评论</Text>
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
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
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

    _onLoadStart() {
        console.log('load start');
    }

    _onLoad() {
        console.log('load');
    }

    _onProgress(data) {
        console.log('in progress', data);
    }

    _onEnd() {
        console.log('end');
    }

    _onError(error) {
        console.log('error', error);
    }

    _focus() {
        this._setModelVisible(true);
    }

    _closeModal() {
        this._setModelVisible(false);
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
                    //更新列表

                    me.setState({
                        isSending: false,
                        content: ''
                        //还有其他值需要设置
                    });

                    me._setModelVisible(false);
                }
            }).catch((error) => {
                console.log(error);
                me.setState({
                    isSending: false
                    //还有其他值需要设置
                });
                me._setModelVisible(false);
                AlertIOS.alert('留言失败,请稍后重试!');
            })
        })
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
    pop_box: {
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
        width: width
    },
    item_thumb: {
        width: width,
        resizeMode: 'contain'
    },
    comments_info_box: {
        width: width,
        marginTop: 10
    },
    comments_author_box: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    comments_avatar: {
        width: 60,
        height: 60,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 30
    },
    comment_desc_box: {
        flex: 1,
    },
    comments_nickname: {
        fontSize: 18
    },
    comments_title: {
        marginTop: 8,
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
        marginTop: 4,
        color: '#666'
    },
    comments_reply_content: {
        flex: 1
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