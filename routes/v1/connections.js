var express = require('express');
const {generateKey, pullDecryptedUserData, pullProfilePhoto} = require("../../src/utils/authUtils");
const {getRatings, getRatedById} = require("../../src/controllers/ratingController");
const {authenticateToken} = require("../../src/utils/tokenHandler");
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

    let onlyRated = req.query.onlyRated;

    let key = generateKey(brightId, password);
    let decryptedUserData = pullDecryptedUserData(key, password);
    let reviewedIds = [];
    if (onlyRated !== undefined) {
        reviewedIds = (await getRatedById(brightId))["rows"].map(row => row.brightid)
    }
    decryptedUserData = await decryptedUserData;

    let photoArray = []
    let startingIndex = page * limit
    let endingIndex = startingIndex + +limit

    let filteredConnections = await decryptedUserData.connections
        .filter(e => {
            if (onlyRated === false) {
                return !reviewedIds.includes(e.id)
            }
            if (onlyRated === true) {
                return reviewedIds.includes(e.id)
            }
            if (onlyRated === undefined) {
                return true
            }
        })
        .filter(e => {
            if (search !== undefined) {
                return e.name.toLowerCase().includes(search.toLowerCase());
            }
            return true
        })
        .slice(startingIndex, endingIndex)
        .map(connection => {
                photoArray.push(pullProfilePhoto(key, connection.id, password))
                return {
                    "brightId": connection.id,
                    "name": connection.name,
                    "status": connection.status
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

    let key = generateKey(brightId, password);
    let decryptedUserData = pullDecryptedUserData(key, password);
    let reviewedIds = (await getRatedById(brightId)).rows.map(row => row.brightid);

    let photoArray = [];

    let connections = (await decryptedUserData)
        .connections
        .filter(e => !reviewedIds.includes(e.id) && e !== connectionId)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
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
        "rateNext": connections,
        "hasRated": reviewedIds.includes(connectionId).toString()
    }))
});


module.exports = router;
