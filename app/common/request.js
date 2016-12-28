'use strict'

var queryString = require('query-string');
var _ = require('lodash');
var Mock = require('mockjs');
var request = {}
var config = require('./config');

request.get = function (url, params) {
    if (params) {
        url += '?' + queryString.stringify(params);
    }

    return fetch(url)
        .then((response) => response.json())
        .then((responseJson) => Mock.mock(responseJson));
}

request.post = function (url, body) {
    var options = _.extend(config.header, {
        body: JSON.stringify(body)
    });

    return fetch(url, options)
        .then((response) => response.json())
        .then((responseJson) => Mock.mock(responseJson));
}

module.exports = request;