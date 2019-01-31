"use strict";
const httpServiceLocator = require('./httpServiceLocator');

let requestToService = function () {
};

requestToService.prototype = {
    sendRequest: function (url, method, body = {}) {
        return new Promise((resolve, reject) => {
            console.log('url: ' + url);
            console.log('method: ' + method);
            console.log('body: ' + JSON.stringify(body));
            httpServiceLocator.send(url, method ? method : 'get', body).then(
                (response) => {
                    console.log('response: ' + JSON.stringify(response), 'yellow');
                    resolve(response);
                },
                (error) => {
                    console.error(error);
                    reject(error);
                }).catch((ex) => {
                reject(ex);
            })
        })
    }
};

let instance = new requestToService();
module.exports = instance;
