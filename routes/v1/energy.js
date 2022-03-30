var express = require('express');
const {getConnection} = require("../../src/controllers/connectionController");
const crypto = require("crypto-js");
const {getSigningKey} = require("../../src/controllers/brightIdController");
const Utf8 = require("crypto-js/enc-utf8");
const {addEnergyTransfer, clearEnergyForBrightId, getEnergy} = require("../../src/controllers/energyController");
var router = express.Router();

router.post('/:fromBrightId', async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId;
    let publicKey = (await getSigningKey(fromBrightId)).rows[0]

    if (publicKey === undefined) {
        res.status(500).send("No public key defined for brightId")
    }

    let decryptedJson = undefined;
    try {
        decryptedJson = JSON.parse(crypto.AES.decrypt(req.body, publicKey).toString(Utf8))
    } catch (exception) {
        res.status(500).send("Could not decrypt using publicKey: " + publicKey)
    }
    if(decryptedJson === undefined || decryptedJson == null) {
        res.status(500).send("decryption issues: " + publicKey);
    }

    let promises = []

    clearEnergyForBrightId(fromBrightId)
    decryptedJson.transfers.forEach(transfer =>
        promises.push(addEnergyTransfer(transfer.toBrightId, fromBrightId, transfer.amount))
    )

    await Promise.all(promises)

    res.json({
        "energyAllocation": (await getEnergy(fromBrightId)).rows
    })
});

module.exports = router;
