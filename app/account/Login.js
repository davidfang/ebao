import React, {Component} from 'react';
import {StyleSheet, AsyncStorage, Dimensions, View, Text, TextInput, AlertIOS} from 'react-native';
import Button from 'react-native-button';
var CountDown = require('react-native-sk-countdown').CountDownText;

import request from '../common/request';
import config from '../common/config';

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            verifyCode: '',
            codeSent: false,
            countingDone: false
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.signup_box}>
                    <Text style={styles.title}>快速登录</Text>
                    <TextInput placeholder="输入手机号" autoCaptialize={"none"}
                               autoCorrect={false} keyboardType={"number-pad"}
                               style={styles.input_field}
                               onChangeText={(text) => {
                                   this.setState({
                                       phoneNumber: text
                                   });
                               }}/>
                    {
                        this.state.codeSent ?
                            <View style={styles.verify_code_box}>
                                <TextInput placeholder="输入验证码" autoCaptialize={"none"}
                                           autoCorrect={false} keyboardType={"number-pad"}
                                           style={styles.verify_input_field}
                                           onChangeText={(text) => {
                                    this.setState({
                                        verifyCode: text
                                    });
                                }}/>
                                {
                                    this.state.countingDone ?
                                        <Button style={styles.count_btn}
                                                onPress={this._sendVerifyCode.bind(this)}>
                                            获取验证码
                                        </Button> :
                                        <CountDown style={styles.count_btn}
                                                   countType='seconds'
                                                   auto={true}
                                                   afterEnd={this._countingDone.bind(this)}
                                                   timeLeft={60}
                                                   step={-1}
                                                   startText='获取验证码'
                                                   endText='获取验证码'
                                                   intervalText={(sec) => "剩余" + sec + "秒"}>
                                        </CountDown>
                                }
                            </View> :
                            null
                    }
                    {
                        this.state.codeSent ?
                            <Button style={styles.btn} onPress={this._submit.bind(this)}>
                                登录
                            </Button> :
                            <Button style={styles.btn} onPress={this._sendVerifyCode.bind(this)}>
                                获取验证码
                            </Button>
                    }
                </View>
            </View>
        );
    }

    _submit() {
        let me = this;
        let phoneNumber = this.state.phoneNumber;
        let verifyCode = this.state.verifyCode;

        if (!phoneNumber || !verifyCode) {
            return AlertIOS.alert('手机号或验证码不能为空!');
        }

        let body = {
            phoneNumber: phoneNumber,
            verifyCode: verifyCode
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

    _sendVerifyCode() {
        let me = this;
        let phoneNumber = this.state.phoneNumber;

        if (!phoneNumber) {
            return AlertIOS.alert('手机号不能为空!');
        }

        let body = {
            phoneNumber: phoneNumber
        };
        let signupUrl = config.api.base + config.api.signup;

        request.post(signupUrl, body).then((data) => {
            if (data && data.success) {
                me._showVerifyCode();
            } else {
                AlertIOS.alert('获取验证码失败,请检查手机号!');
            }
        }).catch((error) => {
            AlertIOS.alert('获取验证码失败,请检查网络!');
        });
    }

    _showVerifyCode() {
        this.setState({
            codeSent: true
        })
    }

    _countingDone() {
        this.setState({
            countingDone: true
        })
    }
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f9f9',
    },
    signup_box: {
        marginTop: 30,
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
    verify_input_field: {
        height: 40,
        width: width - 130,
        padding: 5,
        color: '#666',
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 4
    },
    btn: {
        padding: 10,
        marginTop: 10,
        backgroundColor: 'transparent',
        borderColor: '#ee735c',
        borderWidth: 1,
        borderRadius: 4,
        color: '#ee735c'
    },
    verify_code_box: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    count_btn: {
        width: 100,
        height: 40,
        padding: 10,
        marginLeft: 8,
        backgroundColor: '#ee735c',
        borderColor: '#ee735c',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 15,
        color: '#fff',
        borderRadius: 4
    }
});