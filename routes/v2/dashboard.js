var express = require('express');
const {authenticateToken} = require("../../src/utils/tokenHandler");
const {
    getRatingsGivenForConnection,
    getRatingsRecievedForConnection,
    getInboundConnections,
    getOutboundConnections
} = require("../../src/utils/nodeUtils");
const {pullProfilePhoto, generateKey, pullDecryptedUserData} = require("../../src/utils/authUtils");
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
    let decryptedUserData = await pullDecryptedUserData(key, password);

    let brightIdNameMap = {}

    decryptedUserData.connections.forEach(connection => {
        brightIdNameMap[connection.id] = connection.name
    })

    let recievedPhotos = []
    let givenPhotos = []

    let ratingsRecieved = hydrateConnections(await getInboundConnections(brightId), brightIdNameMap, recievedPhotos, key, password);
    let ratingsGiven = hydrateConnections(await getOutboundConnections(brightId), brightIdNameMap, givenPhotos, key, password);

    await Promise.allSettled(recievedPhotos).then(photos => {
        for (let i = 0; i < photos.length; i++) {
            if (photos[i] === "rejected") {
                ratingsRecieved[i]["photo"] = null
            } else {
                ratingsRecieved[i]["photo"] = photos[i]["value"]
            }
        }
    })
        .catch(
            err => console.log(err)
        )

    await Promise.allSettled(givenPhotos).then(photos => {
        for (let i = 0; i < photos.length; i++) {
            if (photos[i] === "rejected") {
                ratingsGiven[i]["photo"] = null
            } else {
                ratingsGiven[i]["photo"] = photos[i]["value"]
            }
        }
    })
        .catch(
            err => console.log(err)
        )

    return {
        "ratingsRecieved": ratingsRecieved,
        "ratingsGiven": ratingsGiven
    }
}

const hydrateConnections = (connections, brightIdNameMap, photoArray, key, password) => {
    return connections
        .filter(
            connection => connection.conn.rating !== undefined
        )
        .map(connection => {
            connection["name"] = brightIdNameMap[connection._key]
            return connection
        })
        .map(connection => {
            photoArray.push(pullProfilePhoto(key, connection._key, password))
            return {
                "brightId": connection._key,
                "name": connection.name,
                "rating": connection.conn.rating
            };
        });
}


module.exports = router;
