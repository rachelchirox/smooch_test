"use strict";
const httpServiceLocator = require('./httpServiceLocator');

let requestToService = {


    isInProcess : false,

    sendWrapper : function(url, method, body = {}) {

        let time = 0;
        if (requestToService.isInProcess){
            time = 2000;
        }
        setTimeout(function() {
            requestToService.sendRequest(url, method, body);
            console.log('Blah blah blah blah extra-blah');
        }, time);
    },

    sendRequest: function (url, method, body = {}) {
        return new Promise((resolve, reject) => {
            requestToService.isInProcess = true;
            console.log('url: ' + url);
            console.log('method: ' + method);
            console.log('body: ' + JSON.stringify(body));
            httpServiceLocator.send(url, method ? method : 'get', body).then(
                (response) => {
                    console.log('111*');
                    console.log('response: ' + JSON.stringify(response), 'yellow');
                    requestToService.isInProcess = false;
                    resolve(response);
                },
                (error) => {
                    console.log('222*');
                    console.error(error);
                    requestToService.isInProcess = false;
                    reject(error);
                }).catch((ex) => {
                console.log('333*');
                requestToService.isInProcess = false;
                reject(ex);
            })
        })
    }
};

module.exports = requestToService;
