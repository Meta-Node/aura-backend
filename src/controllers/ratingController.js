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
    if(rating.size > 5) {
        throw new Error("Cannot have more than 5 attributes")
    }
    let ratings = 0
    rating.forEach((name, value) => {
        rating += value
    })
    if(values > 5) {
        throw new Error("Attributes are greater than 5")
    }
   return messagesModel.insert(toBrightId, rating, fromBrightId)
}

module.exports = {getRatings, getRatedById}