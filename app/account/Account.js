import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {TabViewAnimated, TabBarTop} from "react-native-tab-view";

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {key: '1', title: '去部'},
                {key: '2', title: '积分获取记录'},
                {key: '3', title: '积分消费记录'}
            ]
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <TouchableOpacity style={styles.header_back_box} onPress={this._goBack.bind(this)}>
                        <Icon style={styles.back_icon} name="ios-arrow-back"/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.header_title}>我的账户</Text>
                </View>
                <View style={styles.body}>
                    <View style={[styles.current_coin, styles.backgound_white,
                        styles.border_bottom, styles.padding_left_and_right]}>
                        <Text style={styles.current_coin_text1}>当前积分:</Text>
                        <Text style={styles.current_coin_text2}>300</Text>
                    </View>
                    <TabViewAnimated
                        style={[styles.container, styles.coin_info, styles.margin_top, this.props.style]}
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
                        <Text>1</Text>
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
            default:
                return null;
        }
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
    backgound_white: {
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
    padding_left_and_right: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    margin_top: {
        marginTop: 10
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
    current_coin: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    current_coin_text1: {
        fontSize: 18
    },
    current_coin_text2: {
        fontSize: 18,
        color: '#ee735c'
    },
    coin_info: {
        marginBottom: 48,
    }
});