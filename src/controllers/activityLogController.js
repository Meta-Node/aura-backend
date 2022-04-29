const Model = require('../models/model')
const keysModel = new Model('activityLog');

async function persistToLog(fromBrightId, toBrightId, action) {
    return keysModel.pool.query('Insert into "activityLog"("fromBrightId", "toBrightId", "action") values ($1, $2, $3)', [fromBrightId, toBrightId, action]);
}

async function getAllAfter(timestamp, limit) {
    return keysModel.pool.query('SELECT * from "activityLog" where timestamp < to_timestamp($1) ORDER BY timestamp asc LIMIT $2', [timestamp, limit]);
}

async function getAllAfterForBrightId(timestamp, limit, fromBrightId) {
    return keysModel.pool.query('SELECT * from "activityLog" where timestamp <= to_timestamp($1) AND ("fromBrightId" = $3 OR "toBrightId" = $3) ORDER BY timestamp asc LIMIT $2', [timestamp, limit, fromBrightId]);
}

async function updateIsImportant(id, val) {
    return keysModel.pool.query('UPDATE "activityLog" SET "isimportant"=$1 where "id"=$2', [val, id])
}


module.exports = {persistToLog, getAllAfter, getAllAfterForBrightId, updateIsImportant}