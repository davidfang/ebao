import {StyleSheet, AsyncStorage, Dimensions, View, Text, TextInput, AlertIOS, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-root-toast';

import request from '../common/request';
import config from '../common/config';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.checkTimer = null;
        this.state = {
            mail: '',
            username: '',
            password: '',
            repassword: '',
            verifyCode: '',
            countingDone: false
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.signup_box}>
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.header_back_box} onPress={this._goBack.bind(this)}>
                            <Icon style={styles.back_icon} name="ios-arrow-back"/>
                            <Text style={styles.back_text}>返回</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>注册</Text>
                    </View>
                    <TextInput placeholder="请输入邮箱" autoCaptialize={"none"}
                               autoCorrect={false} keyboardType={"number-pad"}
                               style={styles.input_field}
                               onChangeText={(text) => {
                                    this.setState({
                                        mail: text
                                    }, () => {
                                        this._checkRegisterInfo('mail');
                                    });
                               }}
                    />
                    <TextInput placeholder="请输入用户名" autoCaptialize={"none"}
                               autoCorrect={false} keyboardType={"number-pad"}
                               style={[styles.input_field, styles.margin_top]}
                               onChangeText={(text) => {
                                    this.setState({
                                        username: text
                                    }, () => {
                                        this._checkRegisterInfo('username');
                                    });
                               }}
                    />
                    <TextInput placeholder="清输入密码" autoCaptialize={"none"} secureTextEntry={true}
                               autoCorrect={false} keyboardType={"number-pad"}
                               style={[styles.input_field, styles.margin_top]}
                               onChangeText={(text) => {
                                   this.setState({
                                       password: text
                                   });
                               }}
                    />
                    <TextInput placeholder="请确认密码" autoCaptialize={"none"} secureTextEntry={true}
                               autoCorrect={false} keyboardType={"number-pad"}
                               style={[styles.input_field, styles.margin_top]}
                               onChangeText={(text) => {
                                   this.setState({
                                       repassword: text
                                   });
                               }}
                    />
                    <View style={styles.verify_code_box}>
                        <TextInput placeholder="输入验证码" autoCaptialize={"none"}
                                   autoCorrect={false} keyboardType={"number-pad"}
                                   style={styles.verify_input_field}
                                   onChangeText={(text) => {
                                        this.setState({
                                            verifyCode: text
                                        });
                                    }}
                        />
                        {
                            this.state.countingDone ?
                                <Button style={styles.count_btn}
                                        onPress={this._sendVerifyCode.bind(this)}>
                                    获取验证码
                                </Button> :
                                <View style={styles.count_btn}>
                                    <Text style={styles.count_btn_text}>获取验证码</Text>
                                </View>
                        }
                    </View>
                    <Button style={styles.register_btn} onPress={this._submit.bind(this)}>
                        注册
                    </Button>
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

    _checkRegisterInfo(type) {
        clearTimeout(this.checkTimer);
        this.checkTimer = setTimeout(() => {
            let url = config.api.host + config.api.user.checkRegisterInfo;
            let params = {};
            if (type === 'mail') {
                params.mail = this.state.mail;
            } else if (type === 'username') {
                params.username = this.state.username;
            }
            request.get(url, params).then((data) => {
                if (data && !data.status) {
                    Toast.show(data.result, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.CENTER,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0
                    });
                }
            })
        }, 300);
    }

    _countingDone() {

    }

    _sendVerifyCode() {

    }

    _submit() {
        let me = this;
        let nameOrAddress = this.state.nameOrAddress;
        let password = this.state.password;

        if (!nameOrAddress) {
            AlertIOS.alert('请输入用户名或邮箱!');
            return;
        }

        if (!password) {
            AlertIOS.alert('请输入密码!');
            return;
        }

        let body = {
            nameOrAddress: nameOrAddress,
            password: password
        };
        let verifyUrl = config.api.base + config.api.verify;

        request.post(verifyUrl, body).then((data) => {
            if (data && data.success) {
                me.props.afterLogin(data.data);
            } else {
                AlertIOS.alert('获取验证码失败,请检查手机号!');
            }
        }).catch((error) => {
            AlertIOS.alert('获取验证码失败,请检查网络!');
        });
    }
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    margin_top: {
        marginTop: 10
    },
    signup_box: {
        marginTop: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    header_back_box: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 8
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
    title: {
        marginBottom: 20,
        color: '#333',
        fontSize: 20,
        textAlign: 'center'
    },
    input_field: {
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 4
    },
    register_btn: {
        padding: 10,
        marginTop: 10,
        backgroundColor: 'transparent',
        borderColor: '#ee735c',
        borderWidth: 1,
        borderRadius: 4,
        color: '#ee735c'
    },
    text_box: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    text: {
        fontSize: 16
    },
    verify_input_field: {
        height: 40,
        width: width - 130,
        padding: 5,
        color: '#666',
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 4
    },
    verify_code_box: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    count_btn: {
        width: 100,
        height: 40,
        backgroundColor: '#ee735c',
        borderColor: '#ee735c',
        borderRadius: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    count_btn_text: {
        fontWeight: '600',
        fontSize: 16,
        color: '#fff'
    }
});