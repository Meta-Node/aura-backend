const Model = require('../models/model')
const messagesModel = new Model('energyTransfer')

const { aql } = require("arangojs");
const { arango } = require("../models/pool.js");

const energyAllocation = arango.collection("energyAllocation");

async function clearEnergyForBrightId(brightId) {
  const userFrom = 'energy/' + brightId;
  await arango.query(aql`
    for e in ${energyAllocation}
      filter e._from == ${userFrom}
      remove e in ${energyAllocation}
  `);
  return messagesModel.pool.query(
    'DELETE from "energyTransfer" where "fromBrightId" = $1',
    [brightId],
  )
}

async function allocateEnergy(to, from, amount, scale) {
  if (amount > 0) {
    const energyFrom = 'energy/' + from;
    const energyTo = 'energy/' + to;
    await arango.query(aql`
      upsert { _to: ${energyTo}, _from: ${energyFrom} }
      insert { _to: ${energyTo}, _from: ${energyFrom}, allocation: ${amount}, modified: DATE_NOW() }
      update { modified: DATE_NOW(), allocation: ${amount} }
      in ${energyAllocation}
    `);
  }

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

async function deleteEnergyAllocation(fromBrightId, toBrightId) {
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
  deleteEnergyAllocation,
  getInboundEnergy,
}
