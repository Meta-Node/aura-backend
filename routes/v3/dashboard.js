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

const IGNITION = 100;

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
    let sparks = (await getSparks(brightId))["rows"]

    let returnSparks = []
    let returnComposites = []
    let energies = new Map();
    sparks.map(spark => {
        spark.amount = parseInt(spark.amount)
        if(!energies.has(spark.energytype)) {
            energies.set(spark.energytype, [spark])
        } else {
            energies.set(spark.energytype, (energies.get(spark.energytype)).push(spark))
        }
    })

    energies.forEach((value, key) => {
        let energyComp = 0;
        value.forEach(spark => energyComp += spark.amount);
        if(energyComp >= IGNITION) {
            sp = value[0];
            ret = {
                "energytype": sp.energytype,
                "amount": energyComp
            }
            returnComposites.push(ret)
        } else {

            returnSparks.push.apply(returnSparks, value);
        }
    })

    return {
        "composite": returnComposites,
        "sparks": returnSparks
    }
}



module.exports = router;
