var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var loginRouter = require('./routes/v1/login');
var usersRouter = require('./routes/v1/connections');
var ratingsRouter = require('./routes/v1/ratings')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/login', loginRouter);
app.use('/v1/users', usersRouter);
app.use('/v1/ratings', ratingsRouter);

module.exports = app;
