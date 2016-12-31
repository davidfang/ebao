import {View, Text, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

export default class User extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <TouchableOpacity style={styles.header_back_box} onPress={this._goBack.bind(this)}>
                        <Icon style={styles.back_icon} name="ios-arrow-back"/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.header_title}>详细资料</Text>
                </View>
                <View style={styles.body}>
                    <View style={[styles.user, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <View style={styles.user_avatar}></View>
                        <View style={styles.user_name}>
                            <Text style={styles.user_real_name}>张三</Text>
                            <Text style={styles.user_name_number}>编号:zhangsan001</Text>
                        </View>
                    </View>
                    <View style={[styles.margin_top, styles.user_item, styles.backgound_white, styles.border_top,
                        styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.user_item_text1}>性别</Text>
                        <Text style={styles.user_item_text2}>男</Text>
                    </View>
                    <View style={[styles.user_more, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={[styles.user_item_text1, styles.margin_right]}>更多发布</Text>
                        <View style={styles.user_more_goods}>
                            <View style={styles.user_good_item}>
                                <Text style={styles.user_good_item_text}>1</Text>
                            </View>
                            <View style={styles.user_good_item}>
                                <Text style={styles.user_good_item_text}>2</Text>
                            </View>
                            <View style={styles.user_good_item}>
                                <Text style={styles.user_good_item_text}>3</Text>
                            </View>
                        </View>
                        <Text style={styles.user_item_text2}>查看</Text>
                    </View>
                    <View style={[styles.margin_top, styles.user_item, styles.backgound_white, styles.border_top,
                        styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.user_item_text1}>好评度</Text>
                        <Text style={styles.user_item_text2}>100%</Text>
                    </View>
                    <Button style={styles.contact_button} onPress={this._contact.bind(this)}>
                         联系商家
                    </Button>
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

    _contact() {

    }
}

const width = Dimensions.get('window').width;
const initialLayout = {
    height: 0,
    width: width,
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    margin_top: {
        marginTop: 10
    },
    margin_right: {
        marginRight: 10
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
    user: {
        width: width,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center'
    },
    user_avatar: {
        width: 60,
        height: 60,
        backgroundColor: '#ee735c',
        borderRadius: 30
    },
    user_name: {
        flex: 1,
        marginLeft: 10
    },
    user_real_name: {
        fontSize: 18,
        fontWeight: '600'
    },
    user_name_number: {
        color: '#666',
        marginTop: 5
    },
    user_edit: {
        width: 32
    },
    user_edit_text: {
        color: '#666',
        fontSize: 16
    },
    user_item: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    user_item_text1: {
        fontSize: 18
    },
    user_item_text2: {
        fontSize: 16,
        color: '#666'
    },
    user_more: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    user_more_goods: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    user_good_item: {
        width: 60,
        height: 60,
        marginRight: 10,
        backgroundColor: '#ee735c',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    user_good_item_text: {
        color: '#fff',
        fontSize: 20
    },
    contact_button: {
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
    }
});