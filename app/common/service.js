'use strict';
import Toast from 'react-native-root-toast';

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

module.exports.checkPasswordFormat = function (mail) {
    return mail.match(/^[a-zA-Z0-9]{8,15}$/);
};