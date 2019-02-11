'use strict';

const express = require('express');
const routes = require('./index');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const testController = require('./testController')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function(req, res) {
//     res.render('index', {
//         appToken: "5c6007ce383ee5002262e55d"
//     });
// });
app.use('/', routes);
app.use('/api', testController);
module.exports = app;
