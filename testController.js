'use strict';
const express = require('express'),
    router = express.Router();
const messagesManager = require('./messagesManager');

router.route('/sendResponse')
    .post(function (req, res) {
        console.log('sendResponse');
        messagesManager.handleReponseFromServer(req.body);
        res.json('ok');
    });

module.exports = router;