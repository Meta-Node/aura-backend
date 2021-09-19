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

app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin
        if(!origin) return callback(null, true);
        if(whitelist.indexOf(origin) === -1){
            var message = 'The CORS policy for this origin does not ' +
            'allow access from the particular origin.';
            return callback(new Error(message), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/login', loginRouter);
app.use('/v1/connections', connectionsRouter);
app.use('/v1/ratings', ratingsRouter);

module.exports = app;
