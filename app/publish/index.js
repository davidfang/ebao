import {View, Text, TextInput, Image, TouchableOpacity, Modal, AlertIOS,
    StyleSheet, Dimensions, NativeModules} from 'react-native';
import React, {Component} from 'react';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import {ImagePickerManager} from 'NativeModules';
/**
 * 说明:此处上传图片应该是多选的,下面的组件就有该功能,
 * 但是因为原生组件不支持,暂时先一张张选了.
 */
import CameraRollPicker from 'react-native-camera-roll-picker';
import Picker from 'react-native-picker';
import sha1 from 'sha1';

import config from '../common/config';
import request from '../common/request';
import Detail from '../creation/Detail';

export default class Publish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            desc: '',
            descImage: '',
            price: 0,

            url: '',

            modalVisible: false,
            progress: 0
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <Text style={styles.header_title}>发布</Text>
                </View>
                <View style={styles.body}>
                    <View style={[styles.border_bottom, styles.backgound_white, styles.padding_left_and_right]}>
                        <TextInput style={styles.title_input} placeholder="标题(品类/品牌/型号等)" value={this.state.title}
                                   onChangeText={this._setStateOfTitle.bind(this)}/>
                    </View>
                    <View style={[styles.border_bottom, styles.backgound_white, styles.padding_left_and_right]}>
                        <TextInput style={styles.desc_input} multiline={true} placeholder="描述下您的宝贝..." value={this.state.desc}
                                   onChangeText={this._setStateOfDesc.bind(this)}/>
                    </View>
                    <View style={[styles.price, styles.border_bottom, styles.backgound_white, styles.padding_left_and_right]}>
                        <View style={styles.price_box}>
                            <Text style={styles.price_text1}>售价</Text>
                            {
                                this.state.price === 0 ?
                                    <Text style={styles.price_text2}>未选择</Text> :
                                    <Text style={styles.price_text2}>{'￥' + this.state.price}</Text>
                            }
                        </View>
                        <Text style={styles.price_text2} onPress={this._selectPrice.bind(this)}>选择</Text>
                    </View>
                    <View style={[styles.photos, styles.border_bottom, styles.backgound_white,
                        styles.padding_left_and_right]}>
                        {
                            this.state.descImage ?
                                <View>
                                    <Image style={styles.photos_box} source={{url: this.state.descImage}}/>
                                </View> :
                                <TouchableOpacity style={styles.photos_box} underlayColor="#fff" onPress={this._selectPhotos.bind(this)}>
                                    <Text style={styles.photos_text}>添加图片</Text>
                                </TouchableOpacity>
                        }
                    </View>
                    <Button style={styles.publish_button} onPress={this._publish.bind(this)}>
                         立即发布
                    </Button>
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

    _selectPhotos() {
        let me = this;

        let descOptions = {
            title: '选择宝贝图片',
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

        ImagePickerManager.showImagePicker(descOptions, (response) => {
            if (response.didCancel) {
                return;
            }

            me._setModalVisible(true);

            let avatarData = 'data:image/jpeg;base64,' + response.data;
            me.setState({
                descImage: avatarData
            });

            let timestamp = Date.now();
            let tags = 'app,avatar';
            let folder = 'avatar';
            let signatureURL = config.api.base + config.api.signature;

            request.post(signatureURL, {
                accessToken: '123',
                timestamp: timestamp,
                type: 'avatar',
                folder: folder,
                tags: tags
            }).then((data) => {
                if (data && data.success) {
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
            });
        });
    }

    _upload(body) {
        let me = this;
        let xhr = new XMLHttpRequest();
        let url = config.CLOUDINARY.image;

        xhr.open('POST', url);
        xhr.onload = () => {
            if (xhr.status !== 200) {
                AlertIOS.alert('请求失败');
                console.log('jiangwu', xhr.responseText);
                return;
            }
            if (!xhr.responseText) {
                AlertIOS.alert('请求失败');
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

    _publish() {
        let me = this;
        let {title, desc, descImage, url, price} = this.state;

        if (!title) {
            AlertIOS.alert('请填写标题内容');
            return;
        }
        if (!desc) {
            AlertIOS.alert('请描述您的宝贝');
            return;
        }
        if (!descImage) {
            AlertIOS.alert('请选择您的宝贝的相关图片');
            return;
        }
        if (!price) {
            AlertIOS.alert('请选择售价');
            return;
        }

        request.put(config.api.host + config.api.good.publish, {
            title: title,
            desc: desc,
            url: url,
            price: price
        }).then((data) => {
            if (data && data.status) {
                AlertIOS.alert(
                    '您的宝贝已上架',
                    '您可继续发布或查看本宝贝详情',
                    [
                        {
                            text: '继续发布',
                            onPress: () => {
                                me._resetStateOfForm();
                            }
                        },
                        {
                            text: '查看宝贝详情',
                            onPress: () => {
                                const {navigator} = me.props;
                                if (navigator) {
                                    navigator.push({
                                        name: 'detail',
                                        component: Detail,
                                        params: {
                                            data: {
                                                "title":"信象然争江点强上传导细每内好强克下。委年但类土器门题化家员音些。共金四际强立般都一位以体在标料次。",
                                                "_id":"220000200801184370",
                                                "video":"http://video.iblack7.com/video_hcwijdwneqantgb4yqgx.mp4",
                                                "author": {
                                                    "avatar":"http://dummyimage.com/640X640/86f279)",
                                                    "nickname":"Jason White"
                                                },
                                                "thumb":"http://dummyimage.com/1280x720/f279a9)",
                                                'resetCallback': me._resetStateOfForm.bind(me)
                                            }
                                        }
                                    });
                                }
                            }
                        },
                    ]
                )
            }
        });
    }

    _createDateData() {
        return (
            ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50',
                '55', '60', '65', '70', '75', '80', '85', '90', '95', '100']
        );
    }

    _selectPrice() {
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
                me.setState({
                    price: parseInt(pickedValue)
                });
            },
            onPickerCancel: (pickedValue, pickedIndex) => {

            },
            onPickerSelect: (pickedValue, pickedIndex) => {

            }
        });
        Picker.show();
    }

    _setStateOfTitle(value) {
        this.setState({
            title: value
        });
    }

    _setStateOfDesc(value) {
        this.setState({
            desc: value
        });
    }

    _resetStateOfForm() {
        this.setState({
            title: '',
            desc: '',
            descImage: '',
            price: 0
        });
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
    margin_top: {
        marginTop: 15,
    },
    header: {
        paddingTop: 25,
        paddingBottom: 12,
        width: width
    },
    header_title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600'
    },
    body: {
        flex: 1,
        backgroundColor: '#ddd'
    },
    title_input: {
        height: 50
    },
    desc_input: {
        width: width - 20,
        height: 100,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 16
    },
    photos: {
        paddingTop: 10,
        paddingBottom: 10
    },
    photos_box: {
        width: 80,
        height: 80,
        backgroundColor: '#ee735c',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    photos_text: {
        fontSize: 16,
        color: '#fff'
    },
    price: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    price_box: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    price_text1: {
        fontSize: 16
    },
    price_text2: {
        fontSize: 16,
        color: '#666'
    },
    publish_button: {
        width: width - 20,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 4,
        color: '#ee735c',
        fontSize: 18,
        backgroundColor: '#ffffff',
        overflow:'hidden'
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