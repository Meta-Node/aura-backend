var express = require('express');
const {generateKey, pullDecryptedUserData, pullProfilePhoto} = require("../../src/utils/authUtils");
const {authenticateToken} = require("../../src/utils/tokenHandler");
const {getConnectionsPaged, getRatedConnections, getAllConnections, getRatings, getRatingsGivenById,
    getNonRatedConnectionsPaged, getRatedById, addNickname, getRatingsGivenForConnection,
    getRatingsRecievedForConnection, getOldRating, getRating
} = require("../../src/utils/nodeUtils");
const {getSparks} = require("../../src/controllers/sparksController");
var router = express.Router();

const DEFAULT_LIMIT = 10

/**
 * gets all connections under a given bright id
 */
router.get('/', authenticateToken, async function (req, res, next) {

    let brightId = req.authData.brightId
    let password = req.authData.password

    let page = req.query.page && req.query.page > 0 ? req.query.page - 1 : 0;
    let limit = req.query.limit ? req.query.limit : DEFAULT_LIMIT;
    let search = req.query["startsWith"] && req.query["startsWith"] !== '' ? req.query["startsWith"] : undefined

    let photoArray = []
    let startingIndex = page * limit

    let onlyRated = req.query.onlyRated;

    let key = generateKey(brightId, password);
    let decryptedUserData = pullDecryptedUserData(key, password);

    let brightIds;

    if (search !== undefined) {
        brightIds = await getAllConnections(brightId)
    } else if (onlyRated !== undefined) {
        if (onlyRated) {
            brightIds = await getRatedConnections(brightId, startingIndex, limit)
        } else {
            brightIds = await getNonRatedConnectionsPaged(brightId, startingIndex, limit)
        }
    } else {
        brightIds = await getConnectionsPaged(brightId, startingIndex, limit)
    }
    decryptedUserData = await decryptedUserData;

    let brightIdNameMap = {}

    decryptedUserData.connections.forEach(connection => {
        brightIdNameMap[connection.id] = connection.name
    })

    let filteredConnections = brightIds
        .map(connection => {
            connection["name"] = brightIdNameMap[connection._key]
            return connection
        })
        .filter(e => {
            if (e.name && search !== undefined) {
                return e.name.toLowerCase().includes(search.toLowerCase());
            } else if (!e.name && search !== undefined) {
                return false
            }
            return true
        })
        .map(connection => {
                photoArray.push(pullProfilePhoto(key, connection._key, password))
                return {
                    "brightId": connection._key,
                    "status": connection.conn.level,
                    "name": connection.name
                };
            }
        );

    await Promise.allSettled(photoArray).then(photos => {
        for (let i = 0; i < photos.length; i++) {
            if (photos[i] === "rejected") {
                filteredConnections[i]["photo"] = null
            } else {
                filteredConnections[i]["photo"] = photos[i]["value"]
            }
        }
    })
        .catch(
            err => console.log(err)
        )
    res.json(filteredConnections)
});

/**
 * gets a specific connection and yet to be rated randomized connections
 */
router.get('/:brightId', authenticateToken, async function (req, res, next) {
    connectionId = req.params.brightId

    let brightId = req.authData.brightId
    let password = req.authData.password

    let ratings = (await getRatings(connectionId))
    let ratingsGiven = (await getRatingsGivenById(connectionId)).length

    let key = generateKey(brightId, password);
    let decryptedUserData = await pullDecryptedUserData(key, password);
    let reviewedIds = (await getRatedById(brightId))

    let oldRating = getRating(brightId, connectionId)

    let brightIdNameMap = {};
    decryptedUserData.connections.forEach(connection => {
        brightIdNameMap[connection.id] = connection.name
    })

    let availableEnergy = await getAvailableEnergy(brightId);
    let sparks = (await getSparks(brightId))["rows"]

    let photoArray = [];

    let connections = (await getNonRatedConnectionsPaged(brightId, 0, 100))
        .map(connection => {
            connection["name"] = brightIdNameMap[connection._key]
            return connection
        })
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map(connection => {
            photoArray.push(pullProfilePhoto(key, connection._key, password))
            return {
                "brightId": connection._key,
                "name": connection.name,
                "status": connection.conn.level
            };
        })

    await Promise.allSettled(photoArray).then(photos => {
        for (let i = 0; i < photos.length; i++) {
            if (photos[i] === "rejected") {
                connections[i]["photo"] = null
            } else {
                connections[i]["photo"] = photos[i]["value"]
            }
        }
    })
        .catch(
            err => console.log(err)
        )

    res.json(({
        "oldRating": await oldRating,
        "availableEnergy": availableEnergy,
        "ratings": ratings,
        "ratingsRecievedNumber": ratings.length,
        "ratingsGivenNumber": ratingsGiven,
        "rateNext": connections,
        "hasRated": reviewedIds.includes(connectionId).toString(),
        "flavors": sparks
    }))
});

/**
 * For upserting the nickname of a connection
 */
router.post("/update-nickname", authenticateToken, async function (req, res, next) {
    let brightId = req.authData.brightId
    let password = req.authData.password

    let nickname = req.body.nickname

    await addNickname(brightId, nickname);
});

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
