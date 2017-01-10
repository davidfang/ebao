'use strict'

module.exports = {
    header: {
        method: 'POST',
        header: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    },

    header_put: {
        method: 'PUT',
        header: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    },

    CLOUDINARY: {
        cloud_name: 'ebao',
        api_key: '539978471152977',
        api_secret: 'iuYGxrtrSRa1cFyrmcwO9N0JvGI',
        base: 'http://res.cloudinary.com/ebao',
        image: 'https://api.cloudinary.com/v1_1/ebao/image/upload'
    },

    imagePath: {
        creationListHeader: '../../assets/images/creation/u6.jpg'
    },
    api: {
        base: 'http://rap.taobao.org/mockjs/11017',
        creations: '/api/creations',
        comment: '/api/comments',
        signup: '/api/u/signup',
        signature: '/api/signatrue',

        host: 'http://localhost:9999/',
        user: {
            getUserByMail: 'user/mail',
            getUserByName: 'user/name/',
            getUser: 'user',
            sendVerifyCode: 'user/code',
            register: 'user',
            updatePassword: 'user/password',
            updateAvatar: 'user/avatar',
            updateGender: 'user/gender'
        },
        good: {
            list: 'goods',
            publish: 'good'
        }
    },

    countdownSeconds: 60,

}