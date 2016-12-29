import {View, Text, Image, ListView, TouchableHighlight, Navigator, StyleSheet, Dimensions} from "react-native";
import React, {Component} from "react";
import {TabViewAnimated, TabBarTop} from "react-native-tab-view";
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import Mock from 'mockjs';

import Detail from './Detail';
import request from '../common/request';
import config from '../common/config';

export default class Home extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            index: 0,
            routes: [
                {key: '1', title: '最新'},
                {key: '2', title: '人气'},
                {key: '3', title: '剩余人次'},
            ],

            dataSource: ds.cloneWithRows([]),

            progress: 0
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.header_title}>e元淘宝</Text>
                </View>
                <Image style={styles.banner} source={require('../../assets/images/creation/home_banner.jpg')}/>
                <TabViewAnimated
                    style={[styles.container, this.props.style]}
                    navigationState={this.state}
                    renderScene={this._renderScene.bind(this)}
                    renderHeader={this._renderHeader}
                    onRequestChangeTab={this._handleChangeTab}
                    initialLayout={initialLayout}
                />
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
                    <View style={styles.container, {marginBottom: 50}}>
                        <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                                  automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                                  renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}/>
                    </View>
                );
            case '2':
                return (
                    <View style={styles.container}>
                        <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                                  automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                                  renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}/>
                    </View>
                );
            case '3':
                return (
                    <View style={styles.container}>
                        <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                                  automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                                  renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}/>
                    </View>
                );
            default:
                return null;
        }
    }

    componentDidMount() {
        this._fetchData();
    }

    _handleChangeTab = (index) => {
        this.setState({
            index,
        });
    }

    _renderItem(rowData, rowID) {
        return (
            <TouchableHighlight onPress={this._gotoDetail.bind(this, rowData)} underlayColor="#fff">
                <View style={styles.item}>
                    <View style={styles.item_main}>
                        <View style={styles.item_image_container}>
                            <Image style={styles.item_thumb} source={require('../../assets/images/creation/list_item.jpg')}/>
                        </View>
                        <View style={styles.item_desc_container}>
                            <Text style={styles.item_title} numberOfLines={2}>
                                苹果MacBook Pro 13.3英寸笔记本电脑 深空灰色(Core i5处理器/256G SSD闪存)
                            </Text>
                            <Text style={[styles.item_total, styles.item_text_font, styles.item_desc_margin]}>总需:1000人次</Text>
                            <Progress.Bar style={styles.item_desc_margin} progress={0.3} height={3} width={214} color={'#ee735c'}/>
                            <View style={[styles.item_state, styles.item_desc_margin]}>
                                <Text style={styles.item_text_font}>已参与人次:100</Text>
                                <Text style={styles.item_remain}>剩余人次:900</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.item_seperator}></View>
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

    _getProgress(offset) {
        var progress = this.state.progress + offset;
        return Math.sin(progress % Math.PI) % 1;
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
    header: {
        paddingTop: 25,
        paddingBottom: 12,
        backgroundColor: '#f9f9f9',
        width: width
    },
    header_title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600'
    },
    banner: {
        width: width,
        height: width * 0.31,
        resizeMode: 'cover'
    },
    tabbar: {
        backgroundColor: '#ee735c'
    },
    indicator: {
        backgroundColor: '#ffeb3b',
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    item_main: {
        width: width-10,
        height: 100,
        marginBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: '#fff',
        flexDirection: 'row'
    },
    item_image_container: {
        paddingTop: 10,
        width: 140,
        justifyContent: 'center'
    },
    item_thumb: {
        width: 140,
        resizeMode: 'contain'
    },
    item_desc_container: {
        flex: 1,
        paddingTop: 10
    },
    item_title: {
        fontSize: 15,
        fontWeight: '500'
    },
    item_desc_margin: {
        marginTop: 5
    },
    item_text_font: {
        fontSize: 14
    },
    item_state: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item_seperator: {
        width: width - 10,
        height: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginLeft: 5
    }
});