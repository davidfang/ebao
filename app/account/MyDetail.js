import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {ImagePickerManager} from 'NativeModules';

import PickerAlert from '../components/PickerAlert';
import PickerWidget from '../components/PickerWidget';

import AddressList from './AddressList';

export default class MyDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sex: '',
            avatarData: ''
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
                                        <Image style={styles.avatar_image} source={{url: this.state.avatarData}}/>
                                    </View> :
                                    <View style={styles.avatar_fake_image}/>
                            }
                        </View>
                        <Text style={styles.avatar_edit} onPress={this._avatarPick.bind(this)}>编辑</Text>
                    </View>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_top, styles.border_bottom, styles.padding_left_and_right, styles.margin_top]}>
                        <Text style={styles.body_item_text1}>用户名</Text>
                        <Text style={styles.body_item_text2}>清除</Text>
                    </View>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.body_item_text1}>编码</Text>
                        <Text style={styles.body_item_text2}>zhangsan 0001</Text>
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
                </View>
                <PickerAlert ref="sex_picker" options={['男', '女']}/>
                <PickerWidget ref="avatar_picker"/>
            </View>
        );
    }

    _setSex(choice) {
        this.setState({
            sex: choice
        });
    }

    _goBack() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.pop();
        }
    }

    _sexPick() {
        this.refs['sex_picker'].show(this, this._setSex);
    }

    _avatarPick() {
        //this.refs['avatar_picker'].show('设置头像', '拍摄', '从相册选择', this);
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

            let avatarData = 'data:image/jpeg;base64,' + response.data;
            me.setState({
                avatarData: avatarData
            });

            // else if (response.error) {
            //     console.log('ImagePicker Error: ', response.error);
            // }
            // else if (response.customButton) {
            //     console.log('User tapped custom button: ', response.customButton);
            // }
            // else {
            //     // You can display the image using either data...
            //     const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
            //
            //     // or a reference to the platform specific asset location
            //     if (Platform.OS === 'ios') {
            //         const source = {uri: response.uri.replace('file://', ''), isStatic: true};
            //     } else {
            //         const source = {uri: response.uri, isStatic: true};
            //     }
            //
            //     this.setState({
            //         avatarSource: source
            //     });
            // }
        });
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
    }
});