const Model = require('../models/model')
const {values} = require("pg/lib/native/query");
const messagesModel = new Model('energyTransfer');

async function addEnergyHoldings(brightId, amount) {
    return messagesModel.pool.query('Insert into "energy"("brightId", "amount") values ($1, $2)', [brightId, amount]);
}

module.exports = { addEnergyHoldings }