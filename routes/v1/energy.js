var express = require('express');
const {getConnection} = require("../../src/controllers/connectionController");
const crypto = require("crypto-js");
const {getSigningKey} = require("../../src/controllers/brightIdController");
const Utf8 = require("crypto-js/enc-utf8");
const {addEnergyTransfer, clearEnergyForBrightId, getEnergy} = require("../../src/controllers/energyController");
const {persistToLog} = require("../../src/controllers/activityLogController");
const {json} = require("express");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
var router = express.Router();

router.post('/:fromBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId;
    let publicKey = req.body.signingKey

    let decryptedJson = req.body;
    // try {
    //     decryptedJson = JSON.parse(crypto.AES.decrypt(req.body, publicKey).toString(Utf8))
    // } catch (exception) {
    //     res.status(500).send("Could not decrypt using publicKey: " + publicKey)
    // }
    // if (decryptedJson === undefined || decryptedJson == null) {
    //     res.status(500).send("decryption issues: " + publicKey);
    // }

    let energy = 0;
    decryptedJson.transfers
        .map(t => t.amount)
        .forEach(t => energy+=t)

    if(energy > 100) {
        res.status(500).send("cannot give out over 100 energy");
    }

    let promises = []

    await clearEnergyForBrightId(fromBrightId)
    decryptedJson.transfers.forEach(transfer => {
            promises.push(addEnergyTransfer(transfer.toBrightId, fromBrightId, transfer.amount))
            promises.push(persistToLog(
                    fromBrightId,
                    transfer.toBrightId,
                    {
                        "action": "ENERGY_TRANSFER",
                        "amount": transfer.amount
                    }
                )
            )
        }
    )

    await Promise.all(promises)

    res.json({
        "energyAllocation": (await getEnergy(fromBrightId)).rows
    })
});

module.exports = router;
