"use strict";
const httpServiceLocator = require('./httpServiceLocator');

let requestToService = {

    myQueue :[],

    initTimer:function() {
        setInterval(function () {
            if (requestToService.myQueue.length > 0 && !requestToService.myQueue[0].notHandeld) {
                requestToService.myQueue[0].notHandeld = true;
                let current = requestToService.myQueue[0];
                requestToService.sendRequest(current.url, current.method, current.body).then(data => {
                    console.log('Blah blah blah blah extra-blah');

                    requestToService.myQueue = requestToService.myQueue.slice(1, requestToService.myQueue.length);
                });
            }
        }, 200);
    },

    // sendWrapper : function(url, method, body = {}) {
    //     requestToService.myQueue.push({url:url, method:method, body:body});
    //
    //     console.log('sendWrapper isInProcess ' + requestToService.isInProcess);
    //     let time = 0;
    //     if (requestToService.isInProcess){
    //         time = 2000;
    //     }
    //     setTimeout(function() {
    //         requestToService.isInProcess = true;
    //         requestToService.sendRequest(url, method, body).then(data => {
    //             console.log('Blah blah blah blah extra-blah');
    //         });
    //     }, time);
    // },

    sendWrapper : function(url, method, body = {}) {

        requestToService.myQueue.push({url:url, method:method, body:body});

        console.log('requestToService.myQueue.push');

    },

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
requestToService.initTimer();
module.exports = requestToService;
