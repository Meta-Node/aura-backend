const Model = require('../models/model')
const {values} = require("pg/lib/native/query");
const sparksModel = new Model('sparks');

async function getSparks(brightId) {
    return await sparksModel.select('energyType, name, amount', ` WHERE sparks.toBrightId = '${brightId}'`);
}


module.exports = {getSparks}