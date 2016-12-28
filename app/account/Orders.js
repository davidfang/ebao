import {Text, View, TouchableOpacity, TouchableHighlight, ListView, Image,
    StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {TabViewAnimated, TabBarTop} from "react-native-tab-view";

export default class Orders extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            index: 0,
            routes: [
                {key: '1', title: '全部'},
                {key: '2', title: '待付款'},
                {key: '3', title: '待收货'},
                {key: '4', title: '待评价'},
                {key: '5', title: '退款'},
            ],

            dataSource: ds.cloneWithRows([
                {
                    image: require('../../assets/images/creation/list_item.jpg'),
                    desc: '苹果MacBook Pro 13.3英寸笔记本电脑 深空灰色(Core i5处理器/256G SSD闪存)',
                    hasBeen: 10
                },
                {
                    image: require('../../assets/images/creation/list_item.jpg'),
                    desc: '苹果MacBook Pro 13.3英寸笔记本电脑 深空灰色(Core i5处理器/256G SSD闪存)',
                    hasBeen: 10
                },
                {
                    image: require('../../assets/images/creation/list_item.jpg'),
                    desc: '苹果MacBook Pro 13.3英寸笔记本电脑 深空灰色(Core i5处理器/256G SSD闪存)',
                    hasBeen: 10
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
                    <Text style={styles.header_title}>我的订单</Text>
                </View>
                <View style={styles.body}>
                    <TabViewAnimated
                        style={[styles.container, this.props.style]}
                        navigationState={this.state}
                        renderScene={this._renderScene.bind(this)}
                        renderHeader={this._renderHeader}
                        onRequestChangeTab={this._handleChangeTab}
                        initialLayout={initialLayout}
                    />
                </View>
            </View>
        );
    }

    _renderHeader = (props) => {
        return (
            <TabBarTop
                {...props}
                indicatorStyle={styles.indicator}
                style={styles.tabbar}
                labelStyle={styles.label}
            />
        )
    };

    _renderScene = ({route}) => {
        switch (route.key) {
            case '1':
                return (
                    <View style={styles.container}>
                        <View style={[styles.margin_top, , styles.backgound_white]}>
                            <View style={[styles.one_good, styles.border_top,
                                styles.border_bottom, styles.padding_left_and_right]}>
                                <Text style={styles.good_text1}>订单编号 201455667788</Text>
                                <Text style={styles.good_text2}>交易完成</Text>
                            </View>
                            <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                                      automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                                      renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}/>
                        </View>
                    </View>
                );
            case '2':
                return (
                    <View style={styles.container}>
                        <Text>2</Text>
                    </View>
                );
            case '3':
                return (
                    <View style={styles.container}>
                        <Text>3</Text>
                    </View>
                );
            case '4':
                return (
                    <View style={styles.container}>
                        <Text>4</Text>
                    </View>
                );
            case '5':
                return (
                    <View style={styles.container}>
                        <Text>5</Text>
                    </View>
                );
            default:
                return null;
        }
    }

    _renderItem(rowData, rowID) {
        return (
            <TouchableHighlight onPress={this._gotoDetail.bind(this, rowData)}>
                <View style={styles.item_box}>
                    <Image style={styles.item_thumb} source={rowData.image}/>
                    <View>
                        <Text>{rowData.desc}</Text>
                        <Text>已参与{rowData.hasBeen}人次</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _handleChangeTab = (index) => {
        this.setState({
            index,
        });
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

        }
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
    tabbar: {
        backgroundColor: '#ee735c'
    },
    indicator: {
        backgroundColor: '#ffeb3b',
    },
    label: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    one_good: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    good_text1: {
        fontSize: 16
    },
    good_text2: {
        fontSize: 16,
        color: '#666'
    },
    item_box: {
        marginTop: 10,
        marginLeft: 20,
        width: width - 40,
    }
});