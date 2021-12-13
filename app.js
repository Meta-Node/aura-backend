require('dotenv').config()
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')

//v1
var loginRouter = require('./routes/v1/login');
var connectionsRouter = require('./routes/v1/connections');
var ratingsRouter = require('./routes/v1/ratings')

//v2
var loginRouterV2 = require('./routes/v2/login');
var connectionsRouterV2 = require('./routes/v2/connections');
var ratingsRouterV2 = require('./routes/v2/ratings')
var dashboardRouterV2 = require('./routes/v2/dashboard')

var boolParser = require('express-query-boolean');
const {json} = require("express");
const {getConnections, getRatingsForConnection, getConnectionsPaged} = require("./src/utils/nodeUtils");
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(boolParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/v1/login', loginRouter);
app.use('/v1/connections', connectionsRouter);
app.use('/v1/ratings', ratingsRouter);
app.use('/v2/login', loginRouterV2);
app.use('/v2/connections', connectionsRouterV2);
app.use('/v2/ratings', ratingsRouterV2);
app.use('/v2/dashboard', dashboardRouterV2)

module.exports = app;
