import {View, Text, Image, Modal, TouchableOpacity, StyleSheet, Dimensions, AsyncStorage} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {ImagePickerManager} from 'NativeModules';
import Picker from 'react-native-picker';
import * as Progress from 'react-native-progress';
import sha1 from 'sha1';
import AddressList from './AddressList';
import request from '../common/request';
import config from '../common/config';
import Service from '../common/service';

export default class MyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            avatarData: '',

            modalVisible: false,
            progress: 0
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <TouchableOpacity style={styles.header_back_box} onPress={this._goBack.bind(this)}>
                        <Icon style={styles.back_icon} name="ios-arrow-back"/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.header_title}>我的</Text>
                </View>
                <View style={styles.body}>
                    <View style={[styles.body_avatar_box, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <View style={styles.avatar_box}>
                            <Text style={styles.avatar_text}>头像</Text>
                            {
                                this.state.avatarData ?
                                    <View>
                                        <Image style={styles.avatar_image} source={{uri: this.state.avatarData}}/>
                                    </View> :
                                    <View style={styles.avatar_fake_image}/>
                            }
                        </View>
                        <Text style={styles.avatar_edit} onPress={this._avatarPick.bind(this)}>
                            {
                                this.state.avatarData ?
                                    '更换' :
                                    '上传'
                            }
                        </Text>
                    </View>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_top, styles.border_bottom, styles.padding_left_and_right, styles.margin_top]}>
                        <Text style={styles.body_item_text1}>{this.state.user.username}</Text>
                        <Text style={styles.body_item_text2}>清除</Text>
                    </View>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.body_item_text1}>性别</Text>
                        <Text style={styles.body_item_text2} onPress={this._sexPick.bind(this)}>选择</Text>
                    </View>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.body_item_text1}>二维码</Text>
                        <Text style={styles.body_item_text2}>查看</Text>
                    </View>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.body_item_text1}>收货地址</Text>
                        <Text style={styles.body_item_text2} onPress={this._gotoView.bind(this)}>查看</Text>
                    </View>
                    <Modal animationType={'fade'} visible={this.state.modalVisible} transparent={true}
                           onRequestClose={() => {this._setModalVisible(false)}}>
                        <View style={styles.modal_container}>
                            <Progress.Pie style={styles.modal_progress} borderColor="#ee735c" color="#ee735c" size={90}
                                          progress={this.state.progress}
                            />
                            <Text style={styles.modal_text}>拼命上传中,请耐心等待!</Text>
                        </View>
                    </Modal>
                </View>
            </View>
        );
    }

    componentDidMount() {
        let me = this;
        AsyncStorage.getItem('user').then((userJson) => {
            let user = JSON.parse(userJson);
            me.setState({
                user: user,
                avatarData: user.avatar
            });
        })
    }

    _goBack() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.pop();
        }
    }

    _setSex(choice) {
        this.setState({
            sex: choice
        });
    }

    _sexPick() {
        let me = this;
        Picker.init({
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: '请选择',
            pickerConfirmBtnColor: [0, 0, 0, 1],
            pickerCancelBtnColor: [0, 0, 0, 1],
            pickerData: me._createDateData(),
            pickerToolBarFontSize: 18,
            pickerFontSize: 20,
            pickerFontColor: [31, 31 ,31, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                let gender = (pickedValue == '男' ? 'male' : 'female');
                request.post(config.api.host + config.api.user.updateGender, {
                    userId: me.state.user._id,
                    gender: gender
                }).then((data) => {
                    if (data && data.status) {
                        Service.showToast('性别修改成功');
                        AsyncStorage.setItem('user', JSON.stringify(data.result));
                    }
                })
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                //console.log('sex', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                //console.log('sex', pickedValue, pickedIndex);
            }
        });
        Picker.show();
    }

    _avatarPick() {
        let me = this;
        let avatarOptions = {
            title: '选择头像',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍摄',
            chooseFromLibraryButtonTitle: '从相册选择',
            quality: 0.75,
            avatarOptions: true,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePickerManager.showImagePicker(avatarOptions, (response) => {
            if (response.didCancel) {
                return;
            }

            me._setModalVisible(true);

            let avatarData = 'data:image/jpeg;base64,' + response.data;
            me.setState({
                avatarData: avatarData
            });

            let timestamp = Date.now();
            let tags = 'app,avatar';
            let folder = 'avatar';

            AsyncStorage.getItem('user').then((userJson) => {
                let user = JSON.parse(userJson);
                if (user) {
                    let signature = 'folder=' + folder + '&tags=' + tags +
                        '&timestamp=' + timestamp + config.CLOUDINARY.api_secret;
                    signature = sha1(signature);

                    let body = new FormData();
                    body.append('folder', folder);
                    body.append('tags', tags);
                    body.append('timestamp', timestamp);
                    body.append('signature', signature);
                    body.append('api_key', config.CLOUDINARY.api_key);
                    body.append('resource_type', 'image');
                    body.append('file', avatarData);

                    me._upload(body);
                }
            })
        });
    }

    _upload(body) {
        let me = this;
        let xhr = new XMLHttpRequest();
        let url = config.CLOUDINARY.image;

        xhr.open('POST', url);
        xhr.onload = () => {
            if (xhr.status !== 200) {
                Service.showToast('请求失败');
                return;
            }
            if (!xhr.responseText) {
                Service.showToast('请求失败');
                return;
            }

            let response;
            try {
                response = JSON.parse(xhr.responseText);
            } catch (e) {
                console.log(e, 'parse fails');
            }

            if (response && response.public_id) {
                me.setState({
                    url: response.url
                });

                request.post(config.api.host + config.api.user.updateAvatar, {
                    userId: me.state.user._id,
                    avatar: response.url
                }).then((data) => {
                    if (data && data.status) {
                        Service.showToast('头像更换成功');
                        AsyncStorage.setItem('user', JSON.stringify(data.result));
                    }
                })
            }
        }

        if (xhr.upload) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    let percent = Number((event.loaded / event.total).toFixed(2));
                    me.setState({
                        progress: percent
                    });

                    if (percent === 1) {
                        me._setModalVisible(false);
                    }
                }
            }
        }

        xhr.send(body);
    }

    _gotoView() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.push({
                name: 'addressList',
                component: AddressList
            });
        }
    }

    _createDateData() {
        return (
            ['男', '女']
        );
    }

    _setModalVisible(isVisible) {
        this.setState({
            modalVisible: isVisible
        });
    }
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    margin_top: {
        marginTop: 10
    },
    border_top: {
        borderTopWidth: 1,
        borderTopColor: '#000'
    },
    border_bottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    padding_left_and_right: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    backgound_white: {
        backgroundColor: '#fff'
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
    body: {
        flex: 1,
        backgroundColor: '#ddd'
    },
    body_avatar_box: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    avatar_box: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar_text: {
        fontSize: 16,
        fontWeight: '400'
    },
    avatar_image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20
    },
    avatar_fake_image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ee735c',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 20
    },
    avatar_edit: {
        fontSize: 16,
        fontWeight: '400',
        color: '#666'
    },
    body_item: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    body_item_text1: {
        fontSize: 16
    },
    body_item_text2: {
        fontSize: 16,
        color: '#666'
    },
    modal_container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingTop: 150,
        alignItems: 'center'
    },
    modal_text: {
        marginTop: 20,
        fontSize: 18,
        color: '#fff'
    }
});