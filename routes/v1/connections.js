var express = require('express');
var router = express.Router();


/**
 * gets all connections under a given bright id
 */
router.get('/', function (req, res, next) {
    let brightId = req.signedCookies.brightId
    if (brightId === undefined) {
        throw new Error("Missing brightId signed cookie, please log in")
    }
    res.json("FUCK")
});

/**
 * gets a specific connection
 */
router.get('/*', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
