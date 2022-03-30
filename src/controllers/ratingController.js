const Model = require('../models/model')
const {values} = require("pg/lib/native/query");
const messagesModel = new Model('ratings');

async function getRatings(brightId) {
    return await messagesModel.select('score', ` WHERE ratings.brightid = '${brightId}'`);
}

async function getConnectionsRated(brightId) {
    return await messagesModel.pool.query(
        'SELECT "toBrightId" from ratings WHERE "fromBrightId" = $1',
        [brightId]
    )
}

function getRatedById(brightId) {
    return messagesModel.select('brightid', ` WHERE ratings.from_brightid = '${brightId}'`)
}

function rateConnection(fromBrightId, toBrightId, rating) {
   return messagesModel.insert(toBrightId, rating, fromBrightId)
}

function getNumberOfRatingsGiven(fromBightId) {
    return messagesModel.countRatingsGiven(fromBightId);
}

function getRating(fromBrightId, toBrightId) {
    return messagesModel.pool.query(
        'SELECT * from "ratings" WHERE "fromBrightId" = $1 AND "toBrightId" = $2',
        [fromBrightId, toBrightId]
    )
}

module.exports = {getRatings, getRatedById, rateConnection, getNumberOfRatingsGiven, getRating}