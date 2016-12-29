import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Settings extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <TouchableOpacity style={styles.header_back_box} onPress={this._goBack.bind(this)}>
                        <Icon style={styles.back_icon} name="ios-arrow-back"/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.header_title}>我的订单</Text>
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
                    <View style={[styles.body_item, styles.backgound_white, styles.border_top, styles.border_bottom,
                        styles.padding_left_and_right, styles.margin_top]}>
                        <Text style={styles.new_message_text1}>退出登录</Text>
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
});