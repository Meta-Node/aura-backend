require('dotenv').config()
var express = require('express')
var path = require('path')
var logger = require('morgan')
var cors = require('cors')

const connectRouter = require('./routes/v1/connect')
const connectionsRouter = require('./routes/v1/connections')
const proxyRouter = require('./routes/v1/proxy')
const energyRouter = require('./routes/v1/energy')
const activityLogRouter = require('./routes/v1/log')
const ratingsRouter = require('./routes/v1/ratings')
const profileRouter = require('./routes/v1/profile')
const nicknameRouter = require('./routes/v1/nicknames')
const publicRouter = require('./routes/v1/oracle')
const feedbackRouter = require('./routes/v1/feedback')
const energyRequestRouter = require('./routes/v1/energyRequest')

var boolParser = require('express-query-boolean')
const { json } = require('express')
const {
  getConnectionArray,
  getConnections,
  getAllConnections,
} = require('./src/controllers/connectionController')
const { clientErrorHandler } = require('./src/middlewear/aurahandler')
var app = express()

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb' }))
app.use(logger('dev'))
app.use(express.json())
app.use(boolParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(clientErrorHandler)

app.use('/v1/connect', connectRouter)
app.use('/v1/connections', connectionsRouter)
app.use('/', proxyRouter)
app.use('/v1/energy', energyRouter)
app.use('/v1/activityLog', activityLogRouter)
app.use('/v1/ratings', ratingsRouter)
app.use('/v1/profile', profileRouter)
app.use('/v1/nickname', nicknameRouter)
app.use('/v1/public', publicRouter)
app.use('/v1/feedback', feedbackRouter)
app.use('/v1/energyRequest', energyRequestRouter)

module.exports = app
