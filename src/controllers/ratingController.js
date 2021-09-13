const Model = require('../models/model')
const messagesModel = new Model('ratings');

async function getRatings(brightId) {
    return await messagesModel.select('score', ` WHERE ratings.brightid = '${brightId}'`);
}

function getRatedById(brightId) {
    return messagesModel.select('brightid', ` WHERE ratings.from_brightid = '${brightId}'`)
}

module.exports = {getRatings, getRatedById}