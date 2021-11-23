var express = require('express');
const {generateKey, pullDecryptedUserData, pullProfilePhoto} = require("../../src/utils/authUtils");
const {authenticateToken} = require("../../src/utils/tokenHandler");
const {getNonRatedConnectionsPaged, getConnectionsPaged} = require("../../src/utils/nodeUtils");
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

    if (onlyRated !== undefined) {
        brightIds = await getConnectionsPaged(brightId, startingIndex, limit)
    } else {
        brightIds = await getNonRatedConnectionsPaged(brightId, startingIndex, limit)
    }
    decryptedUserData = await decryptedUserData;

    let brightIdNameMap = {}

    decryptedUserData.connections.forEach(connection => {
        brightIdNameMap[connection.id] = connection.name
    })

    let filteredConnections = await brightIds
        .map(connection => {
            return connection["name"] = brightIdNameMap[connection._key]
        })
        .filter(e => {
            if (search !== undefined) {
                return e.name.toLowerCase().includes(search.toLowerCase());
            }
            return true
        })
        .map(connection => {
                photoArray.push(pullProfilePhoto(key, connection.id, password))
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

    let ratings = (await getRatings(connectionId))["rows"]
    let ratingsGivenPromise = getNumberOfRatingsGiven(connectionId)

    let key = generateKey(brightId, password);
    let decryptedUserData = pullDecryptedUserData(key, password);
    let reviewedIds = (await getRatedById(brightId)).rows.map(row => row.brightid);

    let photoArray = [];

    let connections = (await decryptedUserData)
        .connections
        .filter(e => !reviewedIds.includes(e.id) && e.id !== connectionId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4)
        .map(connection => {
            photoArray.push(pullProfilePhoto(key, connection.id, password))
            return {
                "brightId": connection.id,
                "name": connection.name,
                "status": connection.status
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
        "ratings": ratings,
        "ratingsRecievedNumber": ratings.length,
        "ratingsGivenNumber": (await ratingsGivenPromise).rows[0],
        "rateNext": connections,
        "hasRated": reviewedIds.includes(connectionId).toString()
    }))
});


module.exports = router;
