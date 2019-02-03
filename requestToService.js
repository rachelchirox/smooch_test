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
                    console.log('111*');
                    console.log('response: ' + JSON.stringify(response), 'yellow');
                    resolve(response);
                },
                (error) => {
                    console.log('222*');
                    console.error(error);
                    reject(error);
                }).catch((ex) => {
                console.log('333*');
                reject(ex);
            })
        })
    }
};

let instance = new requestToService();
module.exports = instance;
