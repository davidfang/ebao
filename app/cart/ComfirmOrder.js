import {View, Text, Image, TouchableOpacity, TouchableHighlight, ListView, StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';
import request from '../common/request';
import config from '../common/config';
import Service from '../common/service';

export default class ComfirmOrder extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([])
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
                    <Text style={styles.header_title}>确认订单</Text>
                </View>
                <View style={styles.body}>
                    <View style={[styles.info, styles.backgound_white, styles.border_bottom, styles.padding_left_and_right]}>
                        <View style={styles.info_item}>
                            <Text style={styles.info_text}>收货人:</Text>
                            <Text style={[styles.info_text, styles.info_item_space]}>张三</Text>
                        </View>
                        <View style={styles.info_item}>
                            <Text style={styles.info_text}>手机号:</Text>
                            <Text style={[styles.info_text, styles.info_item_space]}>13811223344</Text>
                        </View>
                        <View style={styles.info_item}>
                            <Text style={styles.info_text}>收货地址:</Text>
                            <Text style={[styles.info_text, styles.info_item_space]} numberOfLines={2}>上海市杨浦区创智天地3号楼3楼 近五角场</Text>
                        </View>
                    </View>
                    <View style={[styles.list, styles.backgound_white, styles.margin_top, styles.border_top]}>
                        <View style={[styles.footer, styles.backgound_white, styles.border_bottom,
                            styles.padding_left_and_right]}>
                            <Text style={styles.footer_desc}>共3件宝贝,合计56元(含运费6元)</Text>
                            <View>
                                <Button style={styles.footer_btn} onPress={this._check.bind(this)}>提交订单</Button>
                            </View>
                        </View>
                        <ListView dataSource={this.state.dataSource} enableEmptySections={true}
                                  automaticallyAdjustContentInsets={false} showsVerticalScrollIndicator={false}
                                  renderRow={(rowData, sectionID, rowID) => this._renderItem(rowData, rowID)}
                                  renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.item_separator} />}
                        />
                    </View>
                </View>
            </View>
        );
    }

    componentDidMount() {

    }

    _renderItem(rowData, rowID) {
        return (
            <View style={styles.item}>
                <TouchableHighlight style={styles.item_info} underlayColor="#fff">
                    <Image style={styles.item_image} source={require('../../assets/images/creation/list_item.jpg')}/>
                </TouchableHighlight>
                <View style={styles.item_part}>
                    <View style={styles.item_desc}>
                        <Text style={styles.item_desc_text} numberOfLines={2}>{rowData.desc}</Text>
                    </View>
                    <Text style={styles.item_part_number}>参与1份</Text>
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

    _check() {

    }
}

const width = Dimensions.get('window').width;
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
    info: {
        paddingTop: 10,
        paddingBottom: 10
    },
    info_item: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    info_item_space: {
        flex: 1
    },
    info_text: {
        fontSize: 18,
        width: 90,
        color: '#666'
    },
    item_separator: {
        height: 1,
        backgroundColor: '#000',
    },
    item: {
        padding: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
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
    item_part_number: {
        color: '#666',
        fontSize: 15,
        marginTop: 10
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