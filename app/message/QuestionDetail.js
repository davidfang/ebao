import {Text, View, TouchableOpacity, TouchableHighlight, ListView, Image, StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import Detail from '../creation/Detail';

export default class Questions extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([
                {
                    time: '2016-11-11 11:11:11',
                    content: '不包邮'
                },
                {
                    time: '2016-12-12 12:12:12',
                    content: '不议价'
                }
            ])
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <TouchableOpacity style={styles.header_back_box} onPress={this._goBack.bind(this)}>
                        <Icon style={styles.back_icon} name="ios-arrow-back"/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.header_title}>留言详情</Text>
                </View>
                <View style={styles.body}>
                    <View style={[styles.info, styles.border_bottom]}>
                        <View style={styles.info_messager}>
                            <View style={styles.info_messager_avatar}></View>
                            <View style={styles.info_messager_desc}>
                                <Text style={styles.info_messager_nickname}>奥特曼</Text>
                                <Text style={styles.info_messager_time}>2016-11-11 11:11:11</Text>
                            </View>
                        </View>
                        <TouchableHighlight underlayColor="#fff" onPress={this._gotoView.bind(this, 'detail')}>
                            <View style={styles.info_info}>
                                <Image style={styles.info_image} source={require('../../assets/images/creation/list_item.jpg')}/>
                                <Text style={styles.info_desc} numberOfLines={3}>
                                    苹果MacBook Pro 13.3英寸笔记本电脑 深空灰色(Core i5处理器/256G SSD闪存)
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.question, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.quesion_text}>问: 是否包邮?</Text>
                    </View>
                    <View style={[styles.question, styles.margin_top, styles.backgound_white, styles.border_top,
                        styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.quesion_text}>答: 共两条回复</Text>
                    </View>
                    <View style={styles.border_bottom}>
                        <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                                  automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                                  renderRow={(rowData) => this._renderItem(rowData)}
                        />
                    </View>
                </View>
            </View>
        );
    }

    _renderItem(rowData) {
        return (
            <View style={[styles.item, styles.backgound_white]}>
                <View style={[styles.item_container]}>
                    <Text style={styles.item_time}>{rowData.time}</Text>
                    <Text style={styles.item_content}>{rowData.content}</Text>
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

    _gotoView() {

    }
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    border_top: {
        borderTopWidth: 1,
        borderTopColor: '#000'
    },
    border_bottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    margin_top: {
        marginTop: 10
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
    info: {
        padding: 10,
        backgroundColor: '#fff'
    },
    info_messager: {
        flexDirection: 'row'
    },
    info_messager_avatar: {
        width: 40,
        height: 40,
        backgroundColor: '#ee735c',
        borderRadius: 20
    },
    info_messager_desc: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 10
    },
    info_messager_nickname: {
        fontSize: 15,
        fontWeight: '600'
    },
    info_messager_time: {
        fontSize: 15,
        color: '#666'
    },
    info_info: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    info_image: {
        width: 150,
        height: 73
    },
    info_desc: {
        fontSize: 16,
        flex: 1,
        fontWeight: '400'
    },
    question: {
        padding: 10,
        justifyContent: 'center'
    },
    quesion_text: {
        fontSize: 18
    },
    item: {
        padding: 10
    },
    item_container: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 10
    },
    item_time: {
        fontSize: 15,
        color: '#666'
    },
    item_content: {
        fontSize: 18,
        marginTop: 10
    }
});