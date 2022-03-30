const Model = require('../models/model')
const {values} = require("pg/lib/native/query");
const messagesModel = new Model('energyTransfer');

async function clearEnergyForBrightId(brightId) {
    return messagesModel.pool.query('DELETE from "energyTransfer" where "fromBrightId" = $1', brightId);
}

async function addEnergyTransfer(toBrightId, fromBrightId, amount) {
    return messagesModel.pool.query('Insert into "energyTransfer"("fromBrightId", "toBrightId", "amount") values ($1, $2, $3)', [fromBrightId, toBrightId, amount]);
}

async function getEnergy(fromBrightId) {
    return messagesModel.pool.query('SELECT "toBrightId", amount from "energyTransfers" WHERE "fromBrightId" = $1', [fromBrightId]);
}


module.exports = {clearEnergyForBrightId, addEnergyTransfer, getEnergy}