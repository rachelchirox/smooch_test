'use strict';
const express = require('express'),
    router = express.Router();

router.route('/sendResponse')
    .post(function (req, res) {
        console.log('sendResponse:\n');
        res.json('ok');

    });