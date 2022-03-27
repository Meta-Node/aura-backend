const Model = require('../models/model')
const {values} = require("pg/lib/native/query");
const keysModel = new Model('brightIdKeys');

async function persistSigningKey(brightId, signingKey) {
    let text = 'INSERT INTO "brightIdKeys"("brightId", "publicKey") VALUES ($1, $2) ON CONFLICT ("brightId") DO UPDATE SET "publicKey" = $2';
    return await keysModel.pool.query(text, [brightId, signingKey])
}

module.exports = {persistSigningKey}