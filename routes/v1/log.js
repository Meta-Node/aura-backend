const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const {getConnections, getBrightId, get4Unrated} = require("../../src/controllers/connectionController");
const express = require("express");
var router = express.Router();

router.get('/:fromBrightId', validateAuraPlayer, async function (req, res, next) {

});

module.exports = router