const Model = require('../models/model')
const {values} = require("pg/lib/native/query");
const messagesModel = new Model('flavors');

async function getFlavorDetails() {
    return await messagesModel.select('id, name, color', undefined);
}

module.exports = {getFlavorDetails}