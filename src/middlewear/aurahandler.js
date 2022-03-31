const {getSigningKey} = require("../controllers/brightIdController");

async function validateAuraPlayer(req, res, next) {
    let fromBrightId = req.params.fromBrightId;
    let publicKey = (await getSigningKey(fromBrightId)).rows[0]

    if (publicKey === undefined) {
        return res.status(500).send("No public key defined for brightId")
    }

    req.body.signingKey = publicKey
    next()
}

module.exports = {validateAuraPlayer}