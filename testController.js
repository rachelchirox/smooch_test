'use strict';
const express = require('express'),
    router = express.Router();
const messagesManager = require('./messagesManager');

router.route('/sendMessageToClient')
    .post(function (req, res) {
        console.log('sendMessageToClient body: ' + JSON.stringify(req.body, null, 4));
        let userId = req.body.sessionId;
        //let clientType = req.body.clientType;//not supposed to send to this layer, remove it later.
        let dataObject = JSON.parse(req.body.content);
        messagesManager.handleReponseFromServer(dataObject, userId);
        res.json('ok');
    });

module.exports = router;