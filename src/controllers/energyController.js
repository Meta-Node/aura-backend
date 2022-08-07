const Model = require('../models/model')
const { values } = require('pg/lib/native/query')
const messagesModel = new Model('energyTransfer')

async function clearEnergyForBrightId(brightId) {
  return messagesModel.pool.query(
    'DELETE from "energyTransfer" where "fromBrightId" = $1',
    [brightId],
  )
}

async function addEnergyTransfer(toBrightId, fromBrightId, amount, scale) {
  return messagesModel.pool.query(
    'Insert into "energyTransfer"("fromBrightId", "toBrightId", "amount", "scale") values ($1, $2, $3, $4)',
    [fromBrightId, toBrightId, amount, scale],
  )
}

async function getEnergy(fromBrightId) {
  return messagesModel.pool.query(
    'SELECT "toBrightId", amount, scale from "energyTransfer" WHERE "fromBrightId" = $1',
    [fromBrightId],
  )
}

async function getInboundEnergy(toBrightId) {
  return messagesModel.pool.query(
    'SELECT "fromBrightId", amount from "energyTransfer" WHERE "toBrightId" = $1',
    [toBrightId],
  )
}

async function getSpecificEnergy(fromBrightId, toBrightId) {
  return messagesModel.pool.query(
    'SELECT amount from "energyTransfer" WHERE "fromBrightId" = $1 AND "toBrightId" = $2',
    [fromBrightId, toBrightId],
  )
}

async function resetRatingForConnectionPostRating(fromBrightId, toBrightId) {
  return messagesModel.pool.query(
    'DELETE from "energyTransfer" where "fromBrightId" = $1 AND "toBrightId" = $2',
    [fromBrightId, toBrightId],
  )
}

module.exports = {
  clearEnergyForBrightId,
  addEnergyTransfer,
  getEnergy,
  getSpecificEnergy,
  resetRatingForConnectionPostRating,
  getInboundEnergy,
}
