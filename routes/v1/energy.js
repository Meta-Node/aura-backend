const express = require('express')
const {
  allocateEnergy,
  clearEnergyForBrightId,
  getEnergy,
  getInboundEnergy,
} = require('../../src/controllers/energyAllocationController')
const { persistToLog } = require('../../src/controllers/activityLogController')
const { validateAuraPlayer } = require('../../src/middlewear/aurahandler')
const { decrypt } = require('../../src/middlewear/decryption')
var router = express.Router()

//https://github.com/dchest/tweetnacl-js/blob/master/README.md#documentation
//compare energy to ratings
//if rating = 1 can only send 25%
// if 1 < rating <= 2, can only send up to 50%
//if rating < 1, cannot send anything
router.post('/:fromBrightId', validateAuraPlayer, async function (
  req,
  res,
  next,
) {
  let fromBrightId = req.params.fromBrightId
  let publicKey = req.body.signingKey

  let decryptedJson = req.body.encryptedTransfers

  try {
    decryptedJson = decrypt(decryptedJson, publicKey)
  } catch (exception) {
    res.status(500).send('Could not decrypt using publicKey: ' + publicKey)
  }
  if (
    decryptedJson === undefined ||
    decryptedJson == null ||
    decryptedJson.transfers === undefined
  ) {
    res.status(500).send('decryption issues: ' + publicKey)
  }

  let energy = 0
  decryptedJson.transfers.map((t) => t.amount).forEach((t) => (energy += t))

  let promises = []

  await clearEnergyForBrightId(fromBrightId)
  decryptedJson.transfers.forEach((transfer) => {
    promises.push(
      allocateEnergy(
        transfer.toBrightId,
        fromBrightId,
        transfer.amount,
        energy,
      ),
    )
    promises.push(
      persistToLog(fromBrightId, transfer.toBrightId, {
        action: 'ENERGY_TRANSFER',
        amount: transfer.amount,
      }),
    )
  })

  await Promise.all(promises)

  return res.json({
    energyAllocation: (await getEnergy(fromBrightId)).rows,
  })
})

router.get('/inbound/:fromBrightId', validateAuraPlayer, async function (
  req,
  res,
  next,
) {
  let energy = (await getInboundEnergy(req.params.fromBrightId)).rows
  res.json({ energy })
})

router.get('/:fromBrightId', validateAuraPlayer, async function (
  req,
  res,
  next,
) {
  let energy = (await getEnergy(req.params.fromBrightId)).rows
  res.json({ energy })
})

module.exports = router
