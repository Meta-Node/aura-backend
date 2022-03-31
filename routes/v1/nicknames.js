var express = require('express');
const {getConnection} = require("../../src/controllers/connectionController");
var router = express.Router();

router.post('/:fromBrightId/:toBrightId', async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId;
    let toBrightId = req.params.toBrightId;
    let encryptedNickname = req.body.encryptedNickname

    let connection = (await getConnection(fromBrightId, toBrightId))[0];
    if(connection === undefined) {
        res.status(500).send("No connection between these two brightId");
    }


});

module.exports = router;