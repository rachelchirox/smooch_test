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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function(req, res) {
//     res.render('index', {
//         appToken: "5c46da91005ceb0028febd3d"
//     });
// });
app.use('/', routes);
app.use('/test', testController); //new
module.exports = app;
