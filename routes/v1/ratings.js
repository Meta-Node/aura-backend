var express = require('express');
const {authenticateToken} = require("../../src/utils/tokenHandler");
const {rateConnection} = require("../../src/controllers/ratingController");
var router = express.Router();

router.post('/',authenticateToken, function(req, res, next) {
    rateConnection()
});

module.exports = router;
