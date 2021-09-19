require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var loginRouter = require('./routes/v1/login');
var connectionsRouter = require('./routes/v1/connections');
var ratingsRouter = require('./routes/v1/ratings')
const {json} = require("express");
var app = express();



let whitelist = ['http://localhost:3001', 'https://aura.brightid.org/']

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", 'localhost:3001'); // update to match the domain you will make the request from
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader("Access-Control-Allow-Credentials", true)
    next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/login', loginRouter);
app.use('/v1/connections', connectionsRouter);
app.use('/v1/ratings', ratingsRouter);

module.exports = app;
