const Model = require('../models/model')
const keysModel = new Model('brightIdKeys')

async function persistSigningKey(brightId, signingKey) {
  let text =
    'INSERT INTO "brightIdKeys"("brightId", "publicKey") VALUES ($1, $2) ON CONFLICT ("brightId") DO UPDATE SET "publicKey" = $2'
  return keysModel.pool.query(text, [brightId, signingKey])
}

async function getSigningKey(brightId) {
  let query = `SELECT "publicKey"
                 from "brightIdKeys"
                 where "brightId" = $1`
  return keysModel.pool.query(query, [brightId])
}

module.exports = { persistSigningKey, getSigningKey }
