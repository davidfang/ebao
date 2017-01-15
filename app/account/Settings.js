import {View, Text, TouchableOpacity, StyleSheet, Dimensions, AsyncStorage} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';
import PubSub from 'pubsub-js';
import Service from '../common/service';

export default class Settings extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <TouchableOpacity style={styles.header_back_box} onPress={this._goBack.bind(this)}>
                        <Icon style={styles.back_icon} name="ios-arrow-back"/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.header_title}>设置</Text>
                </View>
                <View style={styles.body}>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.new_message_text1}>新消息提醒</Text>
                        <Text style={styles.new_message_text2}>查看</Text>
                    </View>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.new_message_text1}>开启听筒模式</Text>
                        <Text style={styles.new_message_text2}>查看</Text>
                    </View>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_top, styles.border_bottom,
                        styles.padding_left_and_right, styles.margin_top]}>
                        <Text style={styles.new_message_text1}>关于</Text>
                        <Text style={styles.new_message_text2}>查看</Text>
                    </View>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.new_message_text1}>帮助与反馈</Text>
                        <Text style={styles.new_message_text2}>查看</Text>
                    </View>
                    <View style={[styles.body_item, styles.backgound_white, styles.border_top, styles.border_bottom,
                        styles.padding_left_and_right, styles.margin_top]}>
                        <Text style={styles.new_message_text1}>清除缓存</Text>
                        <Text style={styles.new_message_text2}>清除</Text>
                    </View>
                    <View>
                        <Button style={styles.logout_btn} onPress={this._logout.bind(this)}>退出登录</Button>
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

    _logout() {
        AsyncStorage.getItem('user').then((user) => {
            AsyncStorage.removeItem('user');
            PubSub.publish('user_logout');
            Service.showToast('退出成功,请重新登录');
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
    body_item: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    new_message_text1: {
        fontSize: 16
    },
    new_message_text2: {
        fontSize: 16,
        color: '#666'
    },
    logout_btn: {
        width: width - 20,
        marginLeft: 10,
        padding: 15,
        marginTop: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 4,
        color: '#ee735c',
        fontSize: 18,
        backgroundColor: '#ffffff',
        overflow:'hidden'
    }
});