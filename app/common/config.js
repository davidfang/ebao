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

    imagePath: {
        creationListHeader: '../../assets/images/creation/u6.jpg'
    },
    api: {
        base: 'http://rap.taobao.org/mockjs/11017',
        creations: '/api/creations',
        comment: '/api/comments',
        signup: '/api/u/signup',
        verify: '/api/u/verify',
        signature: '/api/signatrue',

        host: 'http://localhost:9999/',
        good: {
            publish: 'good'
        }
    }
}