import {View, Text, TouchableOpacity, TouchableHighlight, ListView, StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

import PickerWidget from '../components/PickerWidget';
import AddressAction from './AddressAction';

export default class AddressList extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(this.props.addresses)
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
                    <Text style={styles.header_title}>收货地址</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.add_address_box}>
                        <Button style={styles.add_address_btn} onPress={this._gotoAddressAction.bind(this, '添加地址')}>添加地址</Button>
                    </View>
                    <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                              automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                              renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}
                    />
                </View>
                <PickerWidget ref="delete_picker"/>
            </View>
        );
    }

    _renderItem(rowData, rowID) {
        return (
            <TouchableHighlight underlayColor="#fff">
                <View style={[styles.item_box, styles.padding_left_and_right]}>
                    <View style={styles.item_nt_box}>
                        <View>
                            <Text style={styles.item_name}>{rowData.name}</Text>
                        </View>
                        <View>
                            <Text style={styles.item_telephone}>{rowData.telephone}</Text>
                        </View>
                    </View>
                    <View style={styles.item_address_box}>
                        <Text style={styles.item_address}>{rowData.address}</Text>
                    </View>
                    <View style={styles.item_action_box}>
                        <View style={styles.item_default_box}>
                            {
                                rowData.isDefault ?
                                    <Text style={styles.item_default}>默认地址</Text> :
                                    null
                            }
                        </View>
                        <View style={styles.item_ed_box}>
                            <Text style={styles.item_ed_text} onPress={this._gotoAddressAction.bind(this, '编辑地址', rowData)}>编辑</Text>
                            <Text style={styles.item_ed_text} onPress={this._delete.bind(this)}>删除</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _goBack() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.pop();
        }
    }

    _delete() {
        this.refs['delete_picker'].show('是否确认删除该地址', '是', '否', this);
    }
    
    _gotoAddressAction(title, rowData) {
        const {navigator} = this.props;
        rowData = rowData || {};
        
        if (navigator) {
            navigator.push({
                name: 'addressAction',
                component: AddressAction,
                params: {
                    title: title,
                    data: rowData
                }
            });
        }
    }
}

const width = Dimensions.get('window').width;
const styles =StyleSheet.create({
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
        backgroundColor: '#ddd',
    },
    item_box: {
        backgroundColor: '#fff',
        marginBottom: 10,
        borderTopWidth: 1,
        borderTopColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    item_nt_box: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10
    },
    item_name: {
        fontSize: 16
    },
    item_telephone: {
        fontSize: 16
    },
    item_address_box: {
        marginTop: 10,
        marginBottom: 10
    },
    item_address: {
        fontSize: 16
    },
    item_action_box: {
        flexDirection: 'row',
        marginBottom: 10
    },
    item_default_box: {
        width: 250
    },
    item_default: {
        color: '#ee735c',
        fontSize: 16
    },
    item_ed_box: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item_ed_text: {
        fontSize: 16
    },
    add_address_box: {
        position: "absolute",
        left: 0,
        bottom: 40,
        zIndex: 999
    },
    add_address_btn: {
        width: width - 20,
        marginLeft: 10,
        padding: 10,
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
