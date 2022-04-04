const Model = require('../models/model')
const {values} = require("pg/lib/native/query");
const messagesModel = new Model('nicknames');

async function upsertNickname(fromBrightId, toBrightId, nickname) {
    return messagesModel.pool.query('INSERT INTO nicknames("fromBrightId", "toBrightId", "nickName") VALUES ($1, $2, $3) ON CONFLICT ("fromBrightId") DO UPDATE SET "nickName" = $3',
        [fromBrightId, toBrightId, nickname]);
}

async function getNickname(fromBrightId, toBrightId) {
    return messagesModel.pool.query('SELECT "nickName" from nicknames where "fromBrightId" = $1 AND "toBrightId" = $2', [fromBrightId, toBrightId]);
}

async function getAllNicknamesForBrightId(brightId) {
    return messagesModel.pool.query('SELECT "toBrightId", "nickName" from nicknames where "fromBrightId" = $1', [brightId]);
}

