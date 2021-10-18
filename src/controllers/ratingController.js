const Model = require('../models/model')
const {values} = require("pg/lib/native/query");
const messagesModel = new Model('ratings');

async function getRatings(brightId) {
    return await messagesModel.select('score', ` WHERE ratings.brightid = '${brightId}'`);
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

module.exports = {getRatings, getRatedById, rateConnection, getNumberOfRatingsGiven}