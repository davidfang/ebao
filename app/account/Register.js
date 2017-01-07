import {StyleSheet, AsyncStorage, Dimensions, View, Text, TextInput, AlertIOS, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';

import request from '../common/request';
import config from '../common/config';
import Service from '../common/service';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.checkTimer = null;
        this.countdownTimer = null;
        this.state = {
            mail: '',
            username: '',
            password: '',
            repassword: '',
            verifyCode: '',

            countdowning: false,
            leftSeconds: config.countdownSeconds
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
                    <TextInput placeholder="请输入邮箱" autoCaptialize={"none"} autoCorrect={false}
                               style={styles.input_field}
                               onChangeText={(text) => {
                                    this.setState({
                                        mail: text
                                    }, () => {
                                        this._checkRegisterInfo('mail');
                                    });
                               }}
                    />
                    <TextInput placeholder="请输入用户名" autoCaptialize={"none"} autoCorrect={false}
                               style={[styles.input_field, styles.margin_top]}
                               onChangeText={(text) => {
                                    this.setState({
                                        username: text
                                    }, () => {
                                        this._checkRegisterInfo('username');
                                    });
                               }}
                    />
                    <TextInput placeholder="请输入密码(8-15位数字与字母)" autoCaptialize={"none"} secureTextEntry={true}
                               autoCorrect={false} style={[styles.input_field, styles.margin_top]}
                               onChangeText={(text) => {
                                   this.setState({
                                       password: text
                                   }, () => {
                                       this._checkRegisterInfo('password');
                                   });
                               }}
                    />
                    <TextInput placeholder="请确认密码" autoCaptialize={"none"} secureTextEntry={true}
                               autoCorrect={false} style={[styles.input_field, styles.margin_top]}
                               onChangeText={(text) => {
                                   this.setState({
                                       repassword: text
                                   }, () => {
                                       this._checkRegisterInfo('repassword');
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
                            this.state.countdowning ?
                                <Button style={styles.send_btn}>
                                    剩余{this.state.leftSeconds}秒
                                </Button> :
                                <Button style={styles.send_btn} onPress={this._sendVerifyCode.bind(this)}>
                                    获取验证码
                                </Button>
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
        if (type === 'mail' || type === 'username') {
            this.checkTimer = setTimeout(() => {
                let url = config.api.host + config.api.user.checkRegisterInfo;
                let params = {};
                if (type === 'mail') {
                    params.mail = this.state.mail;
                } else {
                    params.username = this.state.username;
                }
                request.get(url, params).then((data) => {
                    if (data && !data.status) {
                        Service.showToast(data.result);
                    }
                })
            }, 300);
        } else if (type === 'password' || type === 'repassword') {
            this.checkTimer = setTimeout(() => {
                if (type === 'password' && this.state.password
                    && !Service.checkPasswordFormat(this.state.password)) {
                    Service.showToast('密码格式不正确(8-15位数字与字符),请检查');
                } else if (type === 'repassword') {
                    if (this.state.repassword && !Service.checkPasswordFormat(this.state.password)) {
                        Service.showToast('密码格式不正确(8-15位数字与字符),请检查)');
                    }
                    if (this.state.password !== this.state.repassword) {
                        Service.showToast('两次输入密码不一致,请检查');
                    }
                }
            }, 1000);
        }
    }

    _sendVerifyCode() {
        let {mail, username} = this.state;

        if (!mail || !username) {
            Service.showToast('邮箱和用户名必填');
            return;
        }
        if (!Service.checkMailFormat(mail)) {
            Service.showToast('邮箱格式错误,请检查');
            return;
        }

        request.get(config.api.host + config.api.user.sendVerifyCode, {
            mail: this.state.mail,
            username: this.state.username
        }).then((data) => {
            if (data && data.status) {
                Service.showToast(data.result);
                this.setState({
                    countdowning: true
                }, () => {
                    clearInterval(this.countdownTimer);
                    this.countdownTimer = setInterval(() => {
                        this.setState({
                            leftSeconds: this.state.leftSeconds - 1
                        }, () => {
                            if (this.state.leftSeconds === 0) {
                                clearInterval(this.countdownTimer);
                                this.setState({
                                    countdowning: false,
                                    leftSeconds: config.countdownSeconds
                                });
                            }
                        })
                    }, 1000)
                })
            }
        })
    }

    _countingDone() {

    }

    _submit() {
        let me = this;
        let mail = this.state.mail;
        let username = this.state.username;
        let password = this.state.password;
        let repassword = this.state.repassword;
        let verifyCode = this.state.verifyCode;

        if (!mail || !username || !password || !repassword || !verifyCode) {
            Service.showToast('请输入所有必填信息');
            return;
        }
        if (!Service.checkMailFormat(mail)) {
            Service.showToast('邮箱格式错误,请检查');
            return;
        }
        if (!Service.checkPasswordFormat(password) || !Service.checkPasswordFormat(repassword)) {
            Service.showToast('密码格式不正确(8-15位数字与字符),请检查');
            return;
        } else if (password !== repassword) {
            Service.showToast('两次输入密码不一致,请检查');
            return;
        }

        let url = config.api.host + config.api.user.checkRegisterInfo;
        Service.checkRepeat(url, {
            mail: mail
        }).then((data) => {
            if (data && data.status) {
                return Service.checkRepeat(url, {
                    username: username
                })
            } else {
                Service.showToast(data.result);
            }
        }).then((data) => {
            if (data && data.status) {
                if (verifyCode === data.result.verifyCode) {
                    User.update({username: username}, {password: password});
                } else {
                    Service.showToast('验证码输入错误');
                }
            } else {
                Service.showToast(data.result);
            }
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
    send_btn: {
        width: 100,
        height: 40,
        lineHeight: 40,
        color: '#fff',
        backgroundColor: '#ee735c',
        borderColor: '#ee735c',
        borderRadius: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    }
});