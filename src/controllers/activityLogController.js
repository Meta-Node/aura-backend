const Model = require('../models/model')
const messagesModel = require("../models/model");
const keysModel = new Model('activityLog');

async function persistToLog(fromBrightId, toBrightId, action) {
    return messagesModel.pool.query('Insert into "activityLog"("fromBrightId", "toBrightId", "action") values ($1, $2, $3)', [fromBrightId, toBrightId, action]);
}

async function getAllAfter(timestamp, limit) {
    return messagesModel.pool.query('SELECT * from "activityLog" where timestamp < to_timestamp($1) LIMIT $2', [timestamp, limit]);
}

async function getAllAfterForBrightId(timestamp, limit, fromBrightId, toBrightId) {
    return messagesModel.pool.query('SELECT * from "activityLog" where timestamp <= to_timestamp($1) AND ("fromBrightId" = $3 OR "toBrightId" = $4) LIMIT $2', [timestamp, limit, fromBrightId, toBrightId]);
}


module.exports = {persistToLog}