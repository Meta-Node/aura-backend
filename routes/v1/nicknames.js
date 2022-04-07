var express = require('express');
const {getConnection} = require("../../src/controllers/connectionController");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const {decrypt} = require("../../src/middlewear/decryption");
const {upsertNickname, getAllNicknamesForBrightId} = require("../../src/controllers/nicknameController");
var router = express.Router();

router.post('/:fromBrightId/:toBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId;
    let toBrightId = req.params.toBrightId;
    let encryptedNickname = req.body.encryptedNickname
    let signingKey = req.body.signingKey

    let connection = (await getConnection(fromBrightId, toBrightId))[0];
    if(connection === undefined) {
        res.status(500).send("No connection between these two brightId");
    }
    let nickname = decrypt(encryptedNickname, signingKey)["nickname"]

    await upsertNickname(fromBrightId, toBrightId, nickname)
    let nicknames = (await getAllNicknamesForBrightId()).rows
    res.json({nicknames})

});

router.get('/:fromBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId;
    let nicknames = (await getAllNicknamesForBrightId(fromBrightId)).rows
    res.json({nicknames})
});

module.exports = router;