import {View, Text, Image, ListView, TouchableHighlight, Navigator, StyleSheet, Dimensions, AsyncStorage} from "react-native";
import React, {Component} from "react";
import {TabViewAnimated, TabBarTop} from "react-native-tab-view";
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import Mock from 'mockjs';
import PubSub from 'pubsub-js';
import Detail from './Detail';
import request from '../common/request';
import config from '../common/config';
import Service from '../common/service';

export default class Home extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            index: 0,
            routes: [
                {key: '1', title: '最新'},
                {key: '2', title: '人气'},
                {key: '3', title: '剩余份数'},
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
                    <View style={[styles.container, styles.margin_bottom]}>
                        <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                                  automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                                  renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}
                                  renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.item_separator} />}
                        />
                    </View>
                );
            case '2':
                return (
                    <View style={[styles.container, styles.margin_bottom]}>
                        <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                                  automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                                  renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}
                                  renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.item_separator} />}
                        />
                    </View>
                );
            case '3':
                return (
                    <View style={[styles.container, styles.margin_bottom]}>
                        <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                                  automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                                  renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}
                                  renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.item_separator} />}
                        />
                    </View>
                );
            default:
                return null;
        }
    }

    componentDidMount() {
        let me = this;

        this._fetchData();
        PubSub.subscribe('good_list_update', function (msg) {
            me._fetchData();
        });
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
                                {rowData.desc}
                            </Text>
                            <Text style={[styles.item_total, styles.item_text_font, styles.item_desc_margin]}>
                                总需{rowData.price}份数
                            </Text>
                            <Progress.Bar style={styles.item_desc_margin} progress={0.3} height={3} width={214} color={'#ee735c'}/>
                            <View style={[styles.item_state, styles.item_desc_margin]}>
                                <Text style={styles.item_text_font}>已参与份数:0</Text>
                                <Text style={styles.item_remain}>剩余份数:{rowData.price}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _fetchData() {
        var me = this;
        request.get(config.api.host + config.api.good.list).then((data) => {
            if (data && data.status) {
                me.setState({
                    dataSource: me.state.dataSource.cloneWithRows(data.result)
                });
            }
        })
    }

    _gotoDetail(rowData) {
        const {navigator} = this.props;

        if (navigator) {
            let user = {};
            let paramData = {};
            paramData.user = rowData.publisher;

            AsyncStorage.getItem('user').then((userJson) => {
                user = JSON.parse(userJson);
                return request.get(config.api.host + config.api.good.getById, {
                    goodId: rowData._id
                })
            }).then((data) => {
                if (data && data.status) {
                    paramData.good = data.result;
                    navigator.push({
                        name: 'detail',
                        component: Detail,
                        params: {
                            data: {
                                info: paramData
                            },
                            userId: user._id
                        }
                    });
                } else {
                    Service.showToast('网络出错,请稍后再试');
                }
            }).catch((error) => {
                Service.showToast('网络出错,请稍后再试');
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
    margin_bottom: {
        marginBottom: 50
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
    item_separator: {
        height: 1,
        backgroundColor: '#000',
    }
});