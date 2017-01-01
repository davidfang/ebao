import {View, Text, TextInput, ListView, TouchableOpacity, TouchableHighlight,
    StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';

import Questions from './Questions';

export default class Message extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([
                {
                    image: require('../../assets/images/creation/list_item.jpg'),
                    title: '问题留言',
                    tip: '奥特曼给你留言了'
                },
                {
                    image: require('../../assets/images/creation/list_item.jpg'),
                    title: '问题留言',
                    tip: '奥特曼给你留言了'
                },
                {
                    image: require('../../assets/images/creation/list_item.jpg'),
                    title: '问题留言',
                    tip: '奥特曼给你留言了'
                }
            ])
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.header_title}>消息</Text>
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
            <TouchableHighlight underlayColor="#fff" onPress={this._gotoView.bind(this)}>
                <View style={[styles.item, styles.border_top, styles.border_bottom]}>
                    <View style={styles.item_avatar}>
                        <View style={styles.item_count}>
                            <Text style={styles.item_count_number}>99</Text>
                        </View>
                    </View>
                    <View style={styles.item_messager}>
                        <Text style={styles.item_messager_type}>{rowData.title}</Text>
                        <Text style={styles.item_messager_tip}>{rowData.tip}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _gotoView() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.push({
                name: 'questions',
                component: Questions
            });
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
    item: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        flexDirection: 'row'
    },
    item_avatar: {
        width: 60,
        height: 60,
        backgroundColor: '#ee735c',
        borderRadius: 5
    },
    item_count: {
        width: 20,
        height: 20,
        backgroundColor: 'red',
        borderRadius: 10,
        position: 'absolute',
        left: 50,
        top: -8
    },
    item_count_number: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        lineHeight: 20,
        color: '#fff'
    },
    item_messager: {
        marginLeft: 10,
        justifyContent: 'space-around'
    },
    item_messager_type: {
        fontSize: 18,
        marginBottom: 15
    },
    item_messager_tip: {
        fontSize: 16,
        color: '#666'
    }
});