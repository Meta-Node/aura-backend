require('dotenv').config()
var express = require('express')
var path = require('path')
var logger = require('morgan')
var cors = require('cors')
var Sentry = require('@sentry/node')
var Tracing = require('@sentry/tracing')

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

var boolParser = require('express-query-boolean')

const { clientErrorHandler } = require('./src/middlewear/aurahandler')
var app = express()

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

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

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

module.exports = app
