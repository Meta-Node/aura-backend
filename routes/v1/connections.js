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
    let search = req.query["startsWith"] ? req.query["startsWith"] : ""

    let includeReviewed = req.query.includeReviewed !== undefined ? req.query.includeReviewed : false

    let key = generateKey(brightId, password);
    let decryptedUserData = pullDecryptedUserData(key, password);
    let reviewedIds = [];
    if (!includeReviewed) {
        reviewedIds = (await getRatedById(brightId)).rows.map(row => row.brightid);
    }
    decryptedUserData = await decryptedUserData;

    let photoArray = []
    let startingIndex = page * limit
    let endingIndex = startingIndex + +limit

    let filteredConnections = await decryptedUserData.connections
        .filter(e => !reviewedIds.includes(e.id))
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

    await Promise.all(photoArray).then(photos => {
        for (let i = 0; i < photos.length; i++) {
            filteredConnections[i]["photo"] = photos[i]
        }
    })
    res.json(filteredConnections)
});

/**
 * gets a specific connection and yet to be rated randomized connections
 */
router.get('/:brightId', authenticateToken, function (req, res, next) {
    connectionId = req.params.brightId


    let brightId = req.authData.brightId
    let password = req.authData.password

    ratings = getRatings(connectionId)["rows"]
    res.json({"ratings": ratings});
});


module.exports = router;
