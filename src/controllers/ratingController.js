const Model = require('../models/model')
const messagesModel = new Model('ratings');

async function getRatings(brightId) {
    return await messagesModel.select('score', ` WHERE brightId = ${brightId}`);
}

module.exports = {getRatings}