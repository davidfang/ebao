import {View, Text, TextInput, Image, TouchableOpacity, Modal,
    StyleSheet, Dimensions, NativeModules} from 'react-native';
import React, {Component} from 'react';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {ImagePickerManager} from 'NativeModules';
/**
 * 说明:此处上传图片应该是多选的,下面的组件就有该功能,
 * 但是因为原生组件不支持,暂时先一张张选了.
 */
import CameraRollPicker from 'react-native-camera-roll-picker';
import Picker from 'react-native-picker';

import config from '../common/config';
import request from '../common/request';

export default class Publish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            descImage: '',
            isVisible: false
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
                        <TextInput style={styles.title_input} placeholder="标题(品类/品牌/型号等)"/>
                    </View>
                    <View style={[styles.border_bottom, styles.backgound_white, styles.padding_left_and_right]}>
                        <TextInput style={styles.desc_input} multiline={true} placeholder="描述下你的宝贝..."/>
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
                    <View style={[styles.price, styles.margin_top, styles.border_top, styles.border_bottom,
                        styles.backgound_white, styles.padding_left_and_right]}>
                        <Text style={styles.price_text1}>售价</Text>
                        <Text style={styles.price_text2} onPress={this._selectPrice.bind(this)}>选择</Text>
                    </View>
                    <Button style={styles.publish_button} onPress={this._publish.bind(this)}>
                         立即发布
                    </Button>
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

            let avatarData = 'data:image/jpeg;base64,' + response.data;
            me.setState({
                descImage: avatarData
            });
        });
    }

    _publish() {

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
                console.log('sex', pickedValue, pickedIndex);
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('sex', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('sex', pickedValue, pickedIndex);
            }
        });
        Picker.show();
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
    model_container: {
        flex: 1,
        paddingTop: 45,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    modal_close_icon: {
        alignSelf: 'center',
        fontSize: 30,
        color: '#ee753c'
    },
});