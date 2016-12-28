import {StyleSheet, Dimensions, View, Text, ListView, Image, TouchableHighlight} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Mock from 'mockjs';

import Detail from './Detail';
import request from '../common/request';
import config from '../common/config';

export default class List extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            selectedIndex: 0
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                          automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                          renderRow={(rowData) => this._renderItem(rowData)} />
            </View>
        );
    }

    componentDidMount() {
        this._fetchData();
    }

    _renderItem(rowData) {
        return (
            <TouchableHighlight onPress={this._gotoDetail.bind(this, rowData)}>
                <View style={styles.item}>
                    <Text style={styles.item_title}>{rowData._id}</Text>
                    <Image style={styles.item_thumb} source={{uri: rowData.thumb}}>
                        <Icon style={styles.item_play_icon} name="ios-play" size={28}/>
                    </Image>
                    <View style={styles.item_footer}>
                        <View style={[styles.item_box, styles.item_border_center]}>
                            <Icon style={styles.item_icon} name="ios-heart-outline" size={28}></Icon>
                            <Text style={styles.item_text}>喜欢</Text>
                        </View>
                        <View style={styles.item_box}>
                            <Icon style={styles.item_icon} name="ios-chatboxes-outline" size={28}></Icon>
                            <Text style={styles.item_text}>评论</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _fetchData() {
        var me = this;
        request.get(config.api.base + config.api.creations, {
            'accessToken': '123'
        }).then((data) => {
            if (data && data.success) {
                me.setState({
                    dataSource: me.state.dataSource.cloneWithRows(data.data)
                });
            }
        })
    }

    _gotoDetail(rowData) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'detail',
                component: Detail,
                params: {
                    data: rowData
                }
            });
        }
    }

    _onChange() {

    }
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        width: width,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    item_title: {
        padding: 10,
        fontSize: 18,
        color: '#333'
    },
    item_thumb: {
        width: width,
        height: width * 0.56,
        resizeMode: 'cover'
    },

    item_thumb_1: {
        width: width,
        height: width * 0.31,
        resizeMode: 'cover'
    },
    item_play_icon: {
        width: 46,
        height: 46,
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 23,
        backgroundColor: 'transparent',
        position: 'absolute',
        right: 20,
        bottom: 20,
        textAlign: 'center',
        lineHeight: 46,
        color: '#ed7b66'
    },
    item_footer: {
        flexDirection: 'row',
        width: width,
    },
    item_box: {
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee'
    },
    item_border_center: {
        borderRightWidth: 1,
        borderRightColor: '#fff'
    },
    item_text: {
        fontSize: 18,
        marginLeft: 10,
        color: '#333'
    },
    item_icon: {
        fontSize: 22,
        color: '#333'
    }
});