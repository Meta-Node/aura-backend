const { getSigningKey } = require('../controllers/brightIdController')

async function validateAuraPlayer(req, res, next) {
  let fromBrightId = req.params.fromBrightId
  let publicKey = (await getSigningKey(fromBrightId)).rows[0]

  if (publicKey !== undefined) {
    publicKey = publicKey.publicKey
  }
  if (publicKey === undefined) {
    return res.status(500).send('No public key defined for brightId')
  }

  req.body.signingKey = publicKey
  next()
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}

module.exports = { validateAuraPlayer, clientErrorHandler }
