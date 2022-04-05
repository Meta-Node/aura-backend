const Model = require('../models/model')
const {values} = require("pg/lib/native/query");
const messagesModel = new Model('ratings');

async function getRatings(brightId) {
    return await messagesModel.select('score', ` WHERE ratings.brightid = '${brightId}'`);
}

async function getConnectionsRated(brightId) {
    return messagesModel.pool.query(
        'SELECT "toBrightId" from ratings WHERE "fromBrightId" = $1',
        [brightId]
    );
}

function rateConnection(fromBrightId, toBrightId, rating) {
    return messagesModel.pool.query(
        'Insert into "ratings"("fromBrightId", "toBrightId", "rating") values ($1, $2, $3)',
        [fromBrightId, toBrightId, rating]
    )
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

async function getRatingsReceived(brightId) {
    let ratings = (await messagesModel.pool.query(
        'SELECT * from "ratings" WHERE "toBrightId" = $1',
        [brightId]
    )).rows

    

}

function calculateRating(fromBrightId) {

}

module.exports = {getConnectionsRated, rateConnection, getNumberOfRatingsGiven, getRating}