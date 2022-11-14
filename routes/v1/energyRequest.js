const express = require('express')
const { validateAuraPlayer } = require('../../src/middlewear/aurahandler')
const { decrypt } = require('../../src/middlewear/decryption')
const {
  getRequestForEnergyRecord,
  createRequestForEnergyRecord,
} = require('../../src/controllers/requestForEnergyController')

var router = express.Router()

router.post('/:fromBrightId/create/', validateAuraPlayer, async function (
  req,
  res,
  next,
) {
  let decryptedPayload

  try {
    decryptedPayload = decrypt(req.body.encryptedPayload, req.body.signingKey)
  } catch (exception) {
    res
      .status(500)
      .send('Could not decrypt using publicKey: ' + req.body.signingKey)
  }

  let requestForEnergy
  try {
    requestForEnergy = decryptedPayload.requestForEnergy
  } catch {
    res.status(400).send('Invalid json request')
  }
  if (!requestForEnergy) {
    res.status(400).send('requestForEnergy must be true')
  }

  await createRequestForEnergyRecord(req.params.fromBrightId)

  res.sendStatus(200)
})

router.get('/:brightIds/', async function (req, res, next) {
  let brightIds = req.params.brightIds
    .replace('[', '')
    .replace(']', '')
    .split(',')
  console.log(brightIds)
  let requestForEnergyRecord = await getRequestForEnergyRecord(brightIds)
  res.send(requestForEnergyRecord.rows)
})

module.exports = router
