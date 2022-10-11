const Model = require('../models/model')
const messagesModel = new Model('energyTransfer')

const { aql } = require("arangojs");
const { arango } = require("../models/pool.js");

const energyAllocation = arango.collection("energyAllocation");

async function clearEnergyForBrightId(brightId) {
  const userFrom = 'users/' + brightId;
  await arango.query(aql`
    for e in energyAllocation
      filter e._from = ${userFrom}
      remove e in energyAllocation
  `);
  return messagesModel.pool.query(
    'DELETE from "energyTransfer" where "fromBrightId" = $1',
    [brightId],
  )
}

async function allocateEnergy(to, from, amount, scale) {
  const userFrom = 'users/' + from;
  const userTo = 'users/' + to;
  await arango.query(aql`
    upsert { _to: ${userTo}, _from: ${userFrom} }
    insert { _to: ${userTo}, _from: ${userFrom}, allocation: ${amount} }
    update { modified: DATE_NOW(), allocation: ${amount} }
    in ${energyAllocation}
  `);

  return messagesModel.pool.query(
    'Insert into "energyTransfer"("fromBrightId", "toBrightId", "amount", "scale") values ($1, $2, $3, $4)',
    [from, to, amount, scale],
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
    'SELECT "fromBrightId", amount, scale from "energyTransfer" WHERE "toBrightId" = $1',
    [toBrightId],
  )
}

async function getSpecificEnergy(fromBrightId, toBrightId) {
  return messagesModel.pool.query(
    'SELECT amount, scale from "energyTransfer" WHERE "fromBrightId" = $1 AND "toBrightId" = $2',
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
  allocateEnergy,
  getEnergy,
  getSpecificEnergy,
  resetRatingForConnectionPostRating,
  getInboundEnergy,
}
