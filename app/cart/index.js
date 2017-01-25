import {View, Text, TextInput, ListView, Image, TouchableHighlight, StyleSheet, Dimensions, NativeModules,
    AsyncStorage} from 'react-native';
import React, {Component} from 'react';
import Button from 'react-native-button';
import CameraRollPicker from 'react-native-camera-roll-picker';
import PubSub from 'pubsub-js';
import Detail from '../creation/Detail';
import ConfrimOrder from '../cart/ComfirmOrder';
import request from '../common/request';
import config from '../common/config';
import Service from '../common/service';

export default class Cart extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            data: [],
            dataSource: ds.cloneWithRows([]),
            goodCount: null,
            totalPay: 0,
            buyNumbers: null
        }
    }

    render() {
        if (this.state.goodCount == null || this.state.goodCount) {
            return (
                <View style={[styles.container, styles.margin_bottom]}>
                    <View style={[styles.header, styles.border_bottom]}>
                        <Text style={styles.header_title}>购物车</Text>
                    </View>
                    <View style={styles.body}>
                        <View style={[styles.footer, styles.backgound_white, styles.border_bottom,
                        styles.padding_left_and_right]}>
                            <Text style={styles.footer_desc}>共{this.state.goodCount}件宝贝,您需支付{this.state.totalPay}元开抢</Text>
                            <View>
                                <Button style={styles.footer_btn} onPress={this._gotoView.bind(this, 'confirmOrder')}>去结算</Button>
                            </View>
                        </View>
                        <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                                  automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                                  renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}
                                  renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.item_separator} />}
                        />
                    </View>
                </View>
            ) ;
        } else {
            return (
                <View style={[styles.container,styles.center]}>
                    <Text style={styles.empty_text}>您的购物车空空如也,赶快去夺宝吧</Text>
                </View>
            );
        }
    }

    componentDidMount() {
        let me = this;
        this._fetchData();
        PubSub.subscribe('update_carts', function () {
            me._fetchData();
        });
    }

    _renderItem(rowData, rowID) {
        return (
            <View style={styles.item}>
                <TouchableHighlight style={styles.item_info} underlayColor="#fff" onPress={this._gotoView.bind(this, 'detail', rowData)}>
                    <Image style={styles.item_image} source={require('../../assets/images/creation/list_item.jpg')}/>
                </TouchableHighlight>
                <View style={styles.item_part}>
                    <View style={styles.item_desc}>
                        <Text style={styles.item_desc_text} numberOfLines={2} onPress={this._gotoView.bind(this, 'detail', rowData)}>
                            {rowData.goodId.desc}
                        </Text>
                    </View>
                    <View style={styles.item_number}>
                        <Text style={styles.item_text}>总需人次{rowData.goodId.price}</Text>
                        <Text style={styles.item_text}>剩余人次{rowData.hasBeen}</Text>
                    </View>
                    <View style={styles.item_join}>
                        <Text style={styles.item_join_text}>参与人次</Text>
                        <View>
                            <View style={styles.item_btns}>
                                <TouchableHighlight style={styles.item_btn} underlayColor="#fff"
                                                    onPress={this._doNumber.bind(this, 'minus', rowData.goodId._id)}>
                                    <Text style={styles.item_btn_text}>-</Text>
                                </TouchableHighlight>
                                <View style={styles.item_input_box}>
                                    <TextInput style={styles.item_input_text}
                                               value={this.state.buyNumbers ? this.state.buyNumbers[rowData.goodId._id].toString() : '1'}
                                               maxLength={2}/>
                                </View>
                                <TouchableHighlight style={styles.item_btn} underlayColor="#fff"
                                                    onPress={this._doNumber.bind(this, 'add', rowData.goodId._id)}>
                                    <Text style={styles.item_btn_text}>+</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    _fetchData() {
        let me = this;
        let user = null;

        AsyncStorage.getItem('user').then((userJson) => {
            user = JSON.parse(userJson);
            return request.get(config.api.host + config.api.cart.getAllByUserId, {
                userId: user._id
            });
        }).then((data) => {
            if (data && data.status) {
                let buyNumbers = {};
                let totalPay = 0;
                for (let i in data.result) {
                    buyNumbers[data.result[i].goodId._id] = data.result[i].count;
                    totalPay += parseInt(data.result[i].count);
                }
                me.setState({
                    data: data.result,
                    dataSource: me.state.dataSource.cloneWithRows(data.result),
                    goodCount: data.result.length,
                    totalPay: totalPay,
                    buyNumbers: buyNumbers
                });
            } else if (data && !data.status && data.result == null){
                me.setState({
                    data: [],
                    dataSource: me.state.dataSource.cloneWithRows([]),
                    goodCount: 0
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    _gotoView(name, rowData) {
        const {navigator} = this.props;

        if (navigator) {
            let message = {
                name: name
            };

            if (name === 'detail') {
                message.component = Detail;
                message.params = {
                    data: {
                        info: {
                            user: rowData.buyer,
                            good: rowData.goodId
                        }
                    }
                }
            } else if (name === 'confirmOrder') {
                message.component = ConfrimOrder;
                message.params = {
                    goods: this.state.data
                }
            }

            navigator.push(message);
        }
    }

    _doNumber(type, goodId) {
        let limitFlag = 0;
        let updateFlag = 0;
        let buyNumbers = this.state.buyNumbers;
        if (type === 'minus') {
            for (let id in buyNumbers) {
                if (goodId == id) {
                    if (buyNumbers[goodId] == 1) {
                        limitFlag = -1;
                    } else {
                        buyNumbers[goodId]--;
                        updateFlag = -1;
                    }
                    break;
                }
            }
        } else {
            for (let id in buyNumbers) {
                if (goodId == id) {
                    buyNumbers[goodId]++;
                    updateFlag = 1;
                    break;
                }
            }
        }

        if (limitFlag == -1) {
            Service.showToast('最少购买一份');
            return;
        }

        if (updateFlag) {
            this.setState({
                buyNumbers: buyNumbers,
                totalPay: this.state.totalPay + updateFlag
            });

            let user = null;
            AsyncStorage.getItem('user').then((userJson) => {
                user = JSON.parse(userJson);
                return request.get(config.api.host + config.api.cart.getByUserIdAndGoodId, {
                    userId: user._id,
                    goodId: goodId
                });
            }).then((data) => {
                if (data && data.status) {
                    return request.post(config.api.host + config.api.cart.update, {
                        userId: user._id,
                        goodId: goodId,
                        count: buyNumbers[goodId]
                    })
                } else {
                    Service.showToast('网络出错,请稍后重试');
                }
            }).then((newCart) => {
                if (!newCart) {
                    Service.showToast('网络出错,请稍后重试');
                }
            }).catch((error) => {
                Service.showToast('网络出错,请稍后重试');
            });
        }
    }
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
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
    margin_bottom: {
        marginBottom: 50
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
    },
    empty_text: {
        color: '#ee735c',
        fontSize: 18
    }
});