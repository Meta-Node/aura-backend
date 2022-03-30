var express = require('express');
const {getConnection} = require("../../src/controllers/connectionController");
var router = express.Router();

router.post('/', async function (req, res, next) {
    let fromBrightId = req.body.fromBrightId;
    let toBrightId = req.body.toBrightId;

    let connection = (await getConnection(fromBrightId, toBrightId))[0];
    if(connection === undefined) {
        res.status(500).send("No connection between these two brightId");
    }



});

module.exports = router;
