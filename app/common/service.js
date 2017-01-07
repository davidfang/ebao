'use strict';
import Toast from 'react-native-root-toast';
import request from './request';

module.exports.showToast = function (message) {
    Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
    });
};

module.exports.checkPasswordFormat = function (password) {
    return password.match(/^[a-zA-Z0-9]{8,15}$/);
};


module.exports.checkMailFormat = function (mail) {
    return mail.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/);
};

module.exports.checkRepeat = function (url, params) {
    return request.get(url, params);
};