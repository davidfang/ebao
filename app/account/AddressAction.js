import {View, Text, TextInput, Switch, TouchableOpacity, TouchableHighlight, ListView, StyleSheet,
    Dimensions, AsyncStorage} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Picker from 'react-native-picker';
import PubSub from 'pubsub-js';
import area from '../../data/area.json';
import config from '../common/config';
import request from '../common/request';
import Service from '../common/service';

export default class AddressAction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.data.name,
            telephone: this.props.data.telephone,
            area: this.props.data.area,
            detail: this.props.data.detail,
            isDefault: this.props.data.isDefault
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header]}>
                    <TouchableOpacity style={styles.header_back_box} onPress={this._goBack.bind(this)}>
                        <Icon style={styles.back_icon} name="ios-arrow-back"/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.header_title}>{this.props.title}</Text>
                    <TouchableOpacity style={styles.header_submit} onPress={this._submit.bind(this)}>
                        <Text style={styles.back_text}>保存</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                    <View style={[styles.item, styles.border_top, styles.backgound_white,
                                styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.item_text1}>收货人</Text>
                        <TextInput style={styles.item_input} placeholder="姓名" value={this.state.name}
                                   onChangeText={(text) => {this.setState({name: text})}}/>
                        <Text style={styles.item_text2} onPress={this._emptyName.bind(this)}>清空</Text>
                    </View>
                    <View style={[styles.item, styles.backgound_white,
                                styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.item_text1}>手机号</Text>
                        <TextInput style={styles.item_input} placeholder="手机号" value={this.state.telephone}
                                   onChangeText={(text) => {this.setState({telephone: text})}}/>
                        <Text style={styles.item_text2} onPress={this._emptyTelephone.bind(this)}>清空</Text>
                    </View>
                    <View style={[styles.item, styles.backgound_white,
                                styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.item_text1}>所在地区</Text>
                        <Text style={styles.item_text2} onPress={this._showAreaPicker.bind(this)}>选择</Text>
                    </View>
                    <View style={[styles.item_address, styles.backgound_white,
                                styles.border_bottom, styles.padding_left_and_right]}>
                        <TextInput style={styles.item_address_input} multiline={true} placeholder="详细地址"
                                   value={this.state.detail} onChangeText={(text) => {this.setState({detail: text})}}/>
                    </View>
                    <View style={[styles.item, styles.backgound_white, styles.border_top, styles.border_bottom,
                        styles.margin_top, styles.padding_left_and_right]}>
                        <Text style={styles.item_text1}>设为默认</Text>
                        <Switch onValueChange={(value) => this.setState({isDefault: value})}
                                value={this.state.isDefault} />
                    </View>
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

    _submit() {
        let me = this;
        const {name, telephone, area, detail, isDefault} = this.state;
        if (!name) {
            Service.showToast('请输入收货人姓名');
            return;
        }
        if (!telephone) {
            Service.showToast('请输入收货人手机号');
            return;
        }
        if (!area || !area.length) {
            Service.showToast('请输入收货人所在地区');
            return;
        }
        if (!detail) {
            Service.showToast('请输入收货人详细地址');
            return;
        }
        let address = '';
        if (['北京', '上海', '天津', '重庆'].indexOf(area[0]) !== -1) {
            address = area[0] + '市' + area[2] + detail;
        } else {
            address = area.join('') + detail;
        }

        if (this.props.data._id) {
            request.post(config.api.host + config.api.address.update, {
                addressId: me.props.data._id,
                name: name,
                telephone: telephone,
                area: area,
                detail: detail,
                isDefault: isDefault,
                address: address
            }).then((data) => {
                if (data && data.status) {
                    Service.showToast('地址编辑成功');
                    me._goBack();
                    PubSub.publish('update_addresses');
                } else {
                    Service.showToast('地址编辑失败,请稍后重试');
                }
            });
        } else {
            AsyncStorage.getItem('user').then((userJson) => {
                return request.put(config.api.host + config.api.address.add, {
                    userId: JSON.parse(userJson)._id,
                    name: name,
                    telephone: telephone,
                    area: area,
                    detail: detail,
                    isDefault: isDefault,
                    address: address
                });
            }).then((data) => {
                if (data && data.status) {
                    Service.showToast('地址添加成功');
                    me._goBack();
                    PubSub.publish('update_addresses');
                } else {
                    Service.showToast('地址添加失败,请稍后重试');
                }
            })
        }
    }

    _emptyName() {
        this.setState({
            name: ''
        });
    }

    _emptyTelephone() {
        this.setState({
            telephone: ''
        });
    }

    _showAreaPicker() {
        let me = this;
        Picker.init({
            pickerData: me._createAreaData(),
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: '请选择',
            pickerConfirmBtnColor: [0, 0, 0, 1],
            pickerCancelBtnColor: [0, 0, 0, 1],
            pickerToolBarFontSize: 18,
            pickerFontSize: 20,
            selectedValue: me.state.area,
            onPickerConfirm: pickedValue => {
                me.setState({
                    area: pickedValue
                });
            },
            onPickerCancel: pickedValue => {
                //console.log('area', pickedValue);
            },
            onPickerSelect: pickedValue => {
                //console.log('area', pickedValue);
            }
        });
        Picker.show();
    }

    _createAreaData() {
        let data = [];
        let len = area.length;
        for(let i=0;i<len;i++){
            let city = [];
            for(let j=0,cityLen=area[i]['city'].length;j<cityLen;j++){
                let _city = {};
                _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(_city);
            }

            let _data = {};
            _data[area[i]['name']] = city;
            data.push(_data);
        }
        return data;
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
        alignItems: 'center',
        zIndex: 2
    },
    header_title: {
        width: width - 120,
        textAlign: 'center',
        fontSize: 16
    },
    header_submit: {
        position: 'absolute',
        right: 12,
        top: 32,
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
        backgroundColor: '#ddd',
    },
    item: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    item_input: {
        height: 50,
        width: 250,
        fontSize: 16
    },
    item_text1: {
        fontSize: 16,
    },
    item_text2: {
        fontSize: 16,
        color: '#666'
    },
    item_address_input: {
        width: width - 20,
        height: 100,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 16
    }
});