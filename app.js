require('dotenv').config()
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')
var loginRouter = require('./routes/v1/login');
var connectionsRouter = require('./routes/v1/connections');
var ratingsRouter = require('./routes/v1/ratings')
var boolParser = require('express-query-boolean');
const {json} = require("express");
const {getConnections} = require("./src/utils/nodeUtils");
var app = express();

// getConnections("_oaMaFNsTMF1PHJUAqpGXCjp41Gr19UyoxO4AZlK6bw").then(r => console.log(r))

app.use(logger('dev'));
app.use(express.json());
app.use(boolParser());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/v1/login', loginRouter);
app.use('/v1/connections', connectionsRouter);
app.use('/v1/ratings', ratingsRouter);

module.exports = app;
