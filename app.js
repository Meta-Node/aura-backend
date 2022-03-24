require('dotenv').config()
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')

//v1
// var connectionRouter = require('./routes/v1/login');

var boolParser = require('express-query-boolean');
const {json} = require("express");
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(boolParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

// app.use('/v1/connect', connectionRouter);


module.exports = app;
