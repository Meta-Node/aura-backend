const Model = require('../models/model')
const keysModel = new Model('activityLog');

async function persistToLog(fromBrightId, toBrightId, action) {
    return keysModel.pool.query('Insert into "activityLog"("fromBrightId", "toBrightId", "action") values ($1, $2, $3)', [fromBrightId, toBrightId, action]);
}

async function getAllAfter(timestamp, limit) {
    return keysModel.pool.query('SELECT * from "activityLog" where timestamp < to_timestamp($1) LIMIT $2', [timestamp.toString(), limit]);
}

async function getAllAfterForBrightId(timestamp, limit, fromBrightId) {
    return keysModel.pool.query('SELECT * from "activityLog" where timestamp <= to_timestamp($1) AND ("fromBrightId" = $3 OR "toBrightId" = $3) LIMIT $2', [timestamp, limit, fromBrightId]);
}


module.exports = {persistToLog, getAllAfter, getAllAfterForBrightId}