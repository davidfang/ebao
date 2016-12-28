import {View, Text, Image, Navigator, StyleSheet, Dimensions} from "react-native";
import React, {Component} from "react";
import {TabViewAnimated, TabBarTop} from "react-native-tab-view";
import List from "./List";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {key: '1', title: '最新'},
                {key: '2', title: '人气'},
                {key: '3', title: '剩余人次'},
            ]
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.header_title}>e元淘宝</Text>
                </View>
                <Image style={styles.banner} source={require('../../assets/images/creation/u6.jpg')}/>
                <TabViewAnimated
                    style={[ styles.container, this.props.style ]}
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
                    <Navigator
                        initialRoute={{
                            name: 'list',
                            component: List
                        }}
                        configureScene={(route) => {
                            return Navigator.SceneConfigs.VerticalDownSwipeJump;
                        }}
                        renderScene={(route, navigator) => {
                            let Component = route.component;
                            let setDetailFlagCallbak = route.setDetailFlagCallbak;
                            return (
                                <Component {...route.params} navigator={navigator}/>
                            );
                        }}
                    />
                );
            case '2':
                return (
                    <Navigator
                        initialRoute={{ name: 'list', component: List }}
                        configureScene={(route) => {
                                return Navigator.SceneConfigs.VerticalDownSwipeJump;
                            }}
                        renderScene={(route, navigator) => {
                                let Component = route.component;
                                return <Component {...route.params} navigator={navigator} />;
                            }}
                    />
                );
            case '3':
                return (
                    <Navigator
                        initialRoute={{ name: 'list', component: List }}
                        configureScene={(route) => {
                                return Navigator.SceneConfigs.VerticalDownSwipeJump;
                            }}
                        renderScene={(route, navigator) => {
                                let Component = route.component;
                                return <Component {...route.params} navigator={navigator} />;
                            }}
                    />
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
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        backgroundColor: '#ffeb3b',
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    }
});