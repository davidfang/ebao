import {Text, View, TouchableOpacity, TouchableHighlight, ListView, Image, StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

import Detail from '../creation/Detail';

export default class UserUnused extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([
                {
                    image: require('../../assets/images/creation/list_item.jpg'),
                    desc: '苹果MacBook Pro 13.3英寸笔记本电脑 深空灰色(Core i5处理器/256G SSD闪存 屏幕)',
                    total: 1000,
                    hasBeen: 100
                },
                {
                    image: require('../../assets/images/creation/list_item.jpg'),
                    desc: '苹果MacBook Pro 13.3英寸笔记本电脑 深空灰色(Core i5处理器/256G SSD闪存)',
                    total: 1000,
                    hasBeen: 100
                },
                {
                    image: require('../../assets/images/creation/list_item.jpg'),
                    desc: '苹果MacBook Pro 13.3英寸笔记本电脑 深空灰色(Core i5处理器/256G SSD闪存)',
                    total: 1000,
                    hasBeen: 100
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
                    <Text style={styles.header_title}>卖家闲置</Text>
                </View>
                <View style={styles.body}>
                    <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                              automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                              renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}
                              renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.item_separator} />}
                    />
                </View>
            </View>
        );
    }

    _renderItem(rowData, rowID) {
        return (
            <TouchableHighlight onPress={this._gotoDetail.bind(this)} underlayColor="#fff">
                <View style={styles.item}>
                    <View style={styles.item_publisher}>
                        <View style={styles.item_publisher_avatar}></View>
                        <View style={styles.item_publiser_desc}>
                            <Text style={styles.item_publisher_nickname}>奥特曼</Text>
                            <Text style={styles.item_publisher_time}>3天前</Text>
                        </View>
                    </View>
                    <View style={styles.item_info}>
                        <Image style={styles.item_image} source={rowData.image}/>
                        <Text style={styles.item_desc} numberOfLines={3}>{rowData.desc}</Text>
                    </View>
                    <View style={styles.item_part}>
                        <Text style={styles.item_part_total}>总需人次{rowData.total}</Text>
                        <Text style={styles.item_part_left}>剩余人次{rowData.hasBeen}</Text>
                    </View>
                    <View style={styles.item_progress}>
                        <Progress.Bar progress={0.1} height={3} width={355} color={'#ee735c'}/>
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

    _gotoDetail(rowData) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'detail',
                component: Detail,
                params: {
                    //TODO: 数据都是假的,真实场景下,应该是Good表带出相关信息
                    data: {
                        "title":"信象然争江点强上传导细每内好强克下。委年但类土器门题化家员音些。共金四际强立般都一位以体在标料次。",
                        "_id":"220000200801184370",
                        "video":"http://video.iblack7.com/video_hcwijdwneqantgb4yqgx.mp4",
                        "author": {
                            "avatar":"http://dummyimage.com/640X640/86f279)",
                            "nickname":"Jason White"
                        },
                        "thumb":"http://dummyimage.com/1280x720/f279a9)"
                    }
                }
            });
        }
    }

}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: 60
    },
    border_bottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#000'
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
    item: {
        padding: 10,
        backgroundColor: '#fff'
    },
    item_publisher: {
        flexDirection: 'row'
    },
    item_publisher_avatar: {
        width: 40,
        height: 40,
        backgroundColor: '#ee735c',
        borderRadius: 20
    },
    item_publiser_desc: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 10
    },
    item_publisher_nickname: {
        fontSize: 15,
        fontWeight: '600'
    },
    item_publisher_time: {
        fontSize: 15,
        color: '#666'
    },
    item_info: {
        flexDirection: 'row',
        marginTop: 15
    },
    item_image: {
        width: 150,
        height: 73
    },
    item_desc: {
        fontSize: 16,
        flex: 1,
        fontWeight: '400'
    },
    item_part: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item_part_total: {
        fontWeight: '600',
        fontSize: 15
    },
    item_part_left: {
        fontWeight: '600',
        fontSize: 15
    },
    item_progress: {
        marginTop: 10
    },
    item_separator: {
        height: 1,
        backgroundColor: '#000',
    }
});