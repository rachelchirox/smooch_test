'use strict';
const express = require('express'),
    router = express.Router();
const messagesManager = require('./messagesManager');

router.route('/sendMessageToClient')
    .post(function (req, res) {
        console.log('sendMessageToClient');
        messagesManager.handleReponseFromServer(req.body);
        res.json('ok');
    });

module.exports = router;