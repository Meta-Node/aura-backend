const { query } = require('express')
const { ids } = require('googleapis/build/src/apis/ids')
const Model = require('../models/model')
const eneregyRequestModel = new Model('energyRequest')

async function createRequestForEnergyRecord(brightId) {
  return eneregyRequestModel.pool.query(
    'Insert into "energyRequest"("brightId") values ($1)',
    [brightId],
  )
}

async function getRequestForEnergyRecord(brightIds) {
  return eneregyRequestModel.pool.query(
    `SELECT * from "energyRequest" where "brightId" = ANY($1::varchar[])`,
    [brightIds],
  )
}

module.exports = { createRequestForEnergyRecord, getRequestForEnergyRecord }
