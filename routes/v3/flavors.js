const express = require("express");
const {authenticateToken} = require("../../src/utils/tokenHandler");
const {generateKey} = require("../../src/utils/authUtils");
const {getFlavorDetails} = require("../../src/controllers/flavorsController");
var router = express.Router();

router.get('/', authenticateToken, async function (req, res, next) {
    let flavorDetails = getFlavorDetails();

    res.json({
            flavors: (await flavorDetails)["rows"]
        }
    )
})

module.exports = router;