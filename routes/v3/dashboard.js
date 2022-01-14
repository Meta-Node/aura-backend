var express = require('express');
const {authenticateToken} = require("../../src/utils/tokenHandler");
const {
    getRatingsGivenForConnection,
    getRatingsRecievedForConnection,
    getInboundConnections,
    getOutboundConnections
} = require("../../src/utils/nodeUtils");
const {pullProfilePhoto, generateKey, pullDecryptedUserData} = require("../../src/utils/authUtils");
const {getSparks} = require("../../src/controllers/sparksController");
var router = express.Router();

router.get('/', authenticateToken, async function (req, res, next) {
    let brightId = req.authData.brightId
    let password = req.authData.password

    let key = generateKey(brightId, password);

    let dashboardData = getDashboard(brightId, key, password);

    console.log(dashboardData)
    res.json(
        await dashboardData
    )
})

const getDashboard = async (brightId, key, password) => {
    let composite = await getAvailableEnergy(brightId);
    let sparks = (await getSparks(brightId))["rows"]

    return {
        "composite": composite,
        "sparks": sparks
    }
}

async function getAvailableEnergy(brightId) {
    let energyIn = (await getRatingsRecievedForConnection(brightId))
        .filter(score => score.energyTransfer)
        .map(score => score.energyTransfer)
        .reduce((x,y) => x + y, 0)
    let energyOut = (await getRatingsGivenForConnection(brightId))
        .filter(score => score.energyTransfer)
        .map(score => score.energyTransfer)
        .reduce((x,y) => x + y, 0)

    return Math.max(energyIn - energyOut, 0)
}


module.exports = router;
