const Model = require('../models/model')
const {values} = require("pg/lib/native/query");
const messagesModel = new Model('energy');

async function addEnergy(brightId, amount) {
    return messagesModel.pool.query('Insert into "energy"("brightId", "amount") values ($1, $2) ON CONFLICT ("brightId") DO UPDATE SET "amount" = $2', [brightId, amount]);
}

module.exports = { addEnergy }