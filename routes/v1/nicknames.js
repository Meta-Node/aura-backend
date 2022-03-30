var express = require('express');
var router = express.Router();

router.post('/', async function (req, res, next) {
    let fromBrightId = req.body.fromBrightId;
    let toBrightId = req.body.toBrightId;
    let encryptedNickname = req.body.encryptedNickname

});

module.exports = router;