'use strict';
const express = require('express'),
    router = express.Router();
const messagesManager = require('./messagesManager');
const requestToService = require('./requestToService');

let exteranl_service_path = "http://messenger-manager.us-west-2.elasticbeanstalk.com/response/sendMessageToClient";
exteranl_service_path = 'http://messenger-manager.membitbot.com/messenger-manager/response';
router.route('/sendMessageToClient')
    .post(function (req, res) {
        console.log('sendMessageToClient body: ' + JSON.stringify(req.body, null, 4));
        let userId = req.body.sessionId;
        //let clientType = req.body.clientType;//not supposed to send to this layer, remove it later.
        let dataObject = req.body.content;
        //messagesManager.handleResponseFromServer(dataObject, userId);

        requestToService.sendWrapper(exteranl_service_path , 'post', req.body);//.then(data => {
        //     let dataObject = JSON.parse(data);
        //     console.log('response from ' + exteranl_service_path + ' :' + JSON.stringify(dataObject));
        // });


        // setTimeout(function() {
        //     requestToService.sendRequest(exteranl_service_path , 'post', req.body).then(data => {
        //         let dataObject = JSON.parse(data);
        //         console.log('response from ' + exteranl_service_path + ' :' + JSON.stringify(dataObject));
        //     });
        //     console.log('Blah blah blah blah extra-blah');
        // }, 3000);


        res.json('ok');
    });

module.exports = router;
