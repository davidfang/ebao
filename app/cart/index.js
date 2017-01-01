import {View, Text, TextInput, ListView, Image, TouchableHighlight, StyleSheet, Dimensions, NativeModules} from 'react-native';
import React, {Component} from 'react';
import Button from 'react-native-button';
import CameraRollPicker from 'react-native-camera-roll-picker';

import Detail from '../creation/Detail';
import ConfrimOrder from '../cart/ComfirmOrder';

export default class Cart extends Component {
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
            ]),

            number: "1"
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <Text style={styles.header_title}>购物车</Text>
                </View>
                <View style={styles.body}>
                    <View style={[styles.footer, styles.backgound_white, styles.border_bottom,
                        styles.padding_left_and_right]}>
                        <Text style={styles.footer_desc}>共3件宝贝,合计56元(含运费6元)</Text>
                        <View>
                            <Button style={styles.footer_btn} onPress={this._gotoView.bind(this, 'confirmOrder')}>结算</Button>
                        </View>
                    </View>
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
            <View style={styles.item}>
                <TouchableHighlight style={styles.item_info} underlayColor="#fff" onPress={this._gotoView.bind(this, 'detail')}>
                    <Image style={styles.item_image} source={rowData.image}/>
                </TouchableHighlight>
                <View style={styles.item_part}>
                    <View style={styles.item_desc}>
                        <Text style={styles.item_desc_text} numberOfLines={2}>{rowData.desc}</Text>
                    </View>
                    <View style={styles.item_number}>
                        <Text style={styles.item_text}>总需人次{rowData.total}</Text>
                        <Text style={styles.item_text}>剩余人次{rowData.hasBeen}</Text>
                    </View>
                    <View style={styles.item_join}>
                        <Text style={styles.item_join_text}>参与人次</Text>
                        <View>
                            <View style={styles.item_btns}>
                                <TouchableHighlight style={styles.item_btn} underlayColor="#fff"
                                                    onPress={this._doNumber.bind(this, 'minus')}>
                                    <Text style={styles.item_btn_text}>-</Text>
                                </TouchableHighlight>
                                <View style={styles.item_input_box}>
                                    <TextInput style={styles.item_input_text} value={this.state.number} maxLength={2}/>
                                </View>
                                <TouchableHighlight style={styles.item_btn} underlayColor="#fff"
                                                    onPress={this._doNumber.bind(this, 'add')}>
                                    <Text style={styles.item_btn_text}>+</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    _gotoView(name) {
        const {navigator} = this.props;

        if (navigator) {
            let info = {
                name: name
            };

            if (name === 'detail') {
                info.component = Detail;
                info.params = {
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
            } else if (name === 'confirmOrder') {
                info.component = ConfrimOrder;
            }

            navigator.push(info);
        }
    }

    _doNumber(type) {
        if (type === 'minus') {
            if (parseInt(this.state.number) <= 1) {
                return;
            } else {
                this.setState({
                    number: parseInt(this.state.number) - 1
                });
            }
        } else {
            if (parseInt(this.state.number) >= 99) {
                return;
            } else {
                this.setState({
                    number: parseInt(this.state.number) + 1
                });
            }
        }
    }
}

const width = Dimensions.get('window').width;
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
    item_separator: {
        height: 1,
        backgroundColor: '#000',
    },
    item: {
        padding: 10,
        backgroundColor: '#fff',
        flexDirection: 'row'
    },
    item_info: {
        flexDirection: 'row',
        marginTop: 15
    },
    item_image: {
        width: 150,
        height: 73
    },
    item_part: {
        flex: 1
    },
    item_desc: {

    },
    item_desc_text: {
        flex: 1,
        fontSize: 16
    },
    item_number: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item_text: {
        color: '#666',
        fontSize: 15,
    },
    item_join: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    item_join_text: {
        fontSize: 16
    },
    item_btns: {
        flexDirection: 'row'
    },
    item_btn: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#aaa',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item_input_box: {
        width: 40,
        height: 40,
        borderTopWidth: 1,
        borderTopColor: '#aaa',
        borderBottomWidth: 1,
        borderBottomColor: '#aaa',
    },
    item_input_text: {
        width: 40,
        height: 40,
        padding: 10,
        textAlign: 'center'
    },
    footer: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //position: 'absolute',
        //bottom: 50
    },
    footer_desc: {
        padding: 10,
        fontSize: 15,
        fontWeight: '400'
    },
    footer_btn: {
        width: 80,
        height: 30,
        lineHeight: 30,
        backgroundColor: '#aaa',
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 4,
        color: '#ee735c',
        backgroundColor: '#ffffff',
        overflow:'hidden'
    }
});