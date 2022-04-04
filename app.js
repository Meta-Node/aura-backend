require('dotenv').config()
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')

var connectRouter = require('./routes/v1/connect');
var connectionsRouter = require('./routes/v1/connections')

var boolParser = require('express-query-boolean');
const {json} = require("express");
const {getConnectionArray, getConnections, getAllConnections} = require("./src/controllers/connectionController");
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(boolParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/v1/connect', connectRouter);
app.use('/v1/connections', connectionsRouter)



module.exports = app;
