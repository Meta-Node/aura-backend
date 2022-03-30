const Model = require('../models/model')
const messagesModel = require("../models/model");
const keysModel = new Model('activityLog');

async function persistToLog(fromBrightId, toBrightId, action) {
    return messagesModel.pool.query('Insert into "activityLog"("fromBrightId", "toBrightId", "action") values ($1, $2, $3)', [fromBrightId, toBrightId, action]);
}


module.exports = {persistToLog}