import {AppRegistry, StyleSheet, AsyncStorage, View, Text,
    TabBarIOS, Navigator, ActivityIndicator, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import Home from './app/creation/index';
import Edit from './app/edit/Edit';
import Account from './app/account/index';
import Login from './app/account/Login';
import Slider from './app/account/Slider';

export default class ebao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'accout',
            user: null,
            logined: false,
            booted: false
        }
    }

    render() {
        if (!this.state.booted) {
            return (
                <View style={styles.bootPage}>
                    <ActivityIndicator color="#ee735c"></ActivityIndicator>
                </View>
            );
        }

        if (!this.state.logined) {
            return (<Login afterLogin={this._afterLogin.bind(this)}/>);
        }

        return (
            <TabBarIOS tintColor="#ee735c">
                <Icon.TabBarItem iconName="ios-home-outline" selectedIconName="ios-home" title="首页"
                                 selected={this.state.selectedTab === 'home'}
                                 onPress={() => {
                                    this.setState({
                                        selectedTab: 'home',
                                    });
                                 }}>
                    <Navigator
                        initialRoute={{ name: 'list', component: Home }}
                        configureScene={(route) => {
                                return Navigator.SceneConfigs.FloatFromRight;
                            }}
                        renderScene={(route, navigator) => {
                                let Component = route.component;
                                return <Component {...route.params} navigator={navigator} />;
                            }}
                    />
                </Icon.TabBarItem>
                <Icon.TabBarItem iconName="ios-cart-outline" selectedIconName="ios-cart" title="购物车"
                                 selected={this.state.selectedTab === 'cart'}
                                 onPress={() => {
                                    this.setState({
                                        selectedTab: 'cart'
                                    });
                                 }}>
                    <Edit/>
                </Icon.TabBarItem>
                <Icon.TabBarItem iconName="ios-paw-outline" selectedIconName="ios-paw" title="发布"
                                 selected={this.state.selectedTab === 'publish'}
                                 onPress={() => {
                                    this.setState({
                                        selectedTab: 'publish'
                                    });
                                 }}>
                    <Edit/>
                </Icon.TabBarItem>
                <Icon.TabBarItem iconName="ios-recording-outline" selectedIconName="ios-recording" title="消息"
                                 selected={this.state.selectedTab === 'message'}
                                 onPress={() => {
                                    this.setState({
                                        selectedTab: 'message'
                                    });
                                 }}>
                    <Edit/>
                </Icon.TabBarItem>
                <Icon.TabBarItem iconName="ios-person-outline" selectedIconName="ios-person" title="我的"
                                 selected={this.state.selectedTab === 'accout'}
                                 onPress={() => {
                                    this.setState({
                                        selectedTab: 'accout'
                                    });
                                 }}>
                    <Navigator
                        initialRoute={{ name: 'account', component: Account }}
                        configureScene={(route) => {
                                return Navigator.SceneConfigs.FloatFromRight;
                            }}
                        renderScene={(route, navigator) => {
                                let Component = route.component;
                                return <Component {...route.params} navigator={navigator} />;
                            }}
                    />
                </Icon.TabBarItem>
            </TabBarIOS>
        );
    }

    componentDidMount() {
        this._asyncAppStatus();
    }

    _afterLogin(user) {
        let me = this;
        user = JSON.stringify(user);
        AsyncStorage.setItem('user', user).then(() => {
            me.setState({
                user: user,
                logined: true
            });
        })
    }

    _asyncAppStatus() {
        let me = this;

        AsyncStorage.getItem('user').then((data) => {
            let user = null;
            let newState = {
                booted: true
            };

            if (data) {
                user = JSON.parse(data);
            }
            if (user && user.accessToken) {
                newState.user = user;
                newState.logined = true;
            } else {
                newState.logined = false;
            }

            me.setState(newState);
        })
    }
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    tabContent: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        color: 'white',
        margin: 50,
    },
    bootPage: {
        width: width,
        height: height,
        backgroundColor: '#fff',
        justifyContent: 'center'
    }
});

AppRegistry.registerComponent('ebao', () => ebao);