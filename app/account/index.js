import {View, Text, StyleSheet, Dimensions, AsyncStorage} from 'react-native';
import React, {Component} from 'react';

import MyDetail from './MyDetail';
import Orders from './Orders';
import Unused from './Unused';
import Mark from './Mark';
import Account from './Account';
import Settings from './Settings';

export default class Mine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <Text style={styles.header_title}>我的</Text>
                </View>
                <View style={styles.body}>
                    <View style={[styles.my, styles.backgound_white, styles.border_bottom,
                        styles.padding_left_and_right]}>
                        <View style={styles.my_avatar}></View>
                        <View style={styles.my_name}>
                            <Text style={styles.my_real_name}>{this.state.user.username}</Text>
                        </View>
                        <View style={styles.my_edit}>
                            <Text style={styles.my_edit_text} onPress={this._gotoView.bind(this, 'detail')}>编辑</Text>
                        </View>
                    </View>
                    <View style={[styles.margin_top, styles.my_item, styles.backgound_white, styles.border_top,
                        styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.my_item_text1}>我的订单</Text>
                        <Text style={styles.my_item_text2} onPress={this._gotoView.bind(this, 'orders')}>查看</Text>
                    </View>
                    <View style={[styles.my_item, styles.backgound_white, styles.border_bottom,
                        styles.padding_left_and_right]}>
                        <Text style={styles.my_item_text1}>我的闲置</Text>
                        <Text style={styles.my_item_text2} onPress={this._gotoView.bind(this, 'unused')}>查看</Text>
                    </View>
                    <View style={[styles.my_item, styles.backgound_white, styles.border_bottom,
                        styles.padding_left_and_right]}>
                        <Text style={styles.my_item_text1}>我的收藏</Text>
                        <Text style={styles.my_item_text2} onPress={this._gotoView.bind(this, 'mark')}>查看</Text>
                    </View>
                    <View style={[styles.margin_top, styles.my_item, styles.backgound_white, styles.border_top,
                        styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.my_item_text1}>我的账户</Text>
                        <Text style={styles.my_item_text2} onPress={this._gotoView.bind(this, 'account')}>查看</Text>
                    </View>
                    <View style={[styles.margin_top, styles.my_item, styles.backgound_white, styles.border_top,
                        styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.my_item_text1}>设置</Text>
                        <Text style={styles.my_item_text2} onPress={this._gotoView.bind(this, 'settings')}>查看</Text>
                    </View>
                </View>
            </View>
        );
    }

    componentDidMount() {
        let me = this;
        AsyncStorage.getItem('user').then((user) => {
            me.setState({
                user: JSON.parse(user)
            });
        })
    }

    _gotoView(type) {
        const {navigator} = this.props;

        if (navigator) {
            let component = null;

            switch (type) {
                case 'detail':
                    component = MyDetail;
                    break;
                case 'orders':
                    component = Orders;
                    break;
                case 'unused':
                    component = Unused;
                    break;
                case 'mark':
                    component = Mark;
                    break;
                case 'account':
                    component = Account;
                    break;
                case 'settings':
                    component = Settings;
                    break;
                default:
                    break;
            }

            navigator.push({
                name: type,
                component: component
            });
        }
    }
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
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
    my: {
        width: width,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center'
    },
    my_avatar: {
        width: 60,
        height: 60,
        backgroundColor: '#ee735c',
        borderRadius: 30
    },
    my_name: {
        flex: 1,
        marginLeft: 10
    },
    my_real_name: {
        fontSize: 18,
        fontWeight: '600'
    },
    my_name_number: {
        color: '#666',
        marginTop: 5
    },
    my_edit: {
        width: 34
    },
    my_edit_text: {
        color: '#666',
        fontSize: 16
    },
    my_item: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    my_item_text1: {
        fontSize: 18
    },
    my_item_text2: {
        fontSize: 16,
        color: '#666'
    }
});