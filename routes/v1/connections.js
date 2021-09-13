var express = require('express');
const {generateKey, pullDecryptedUserData, pullProfilePhoto} = require("../../src/utils/authUtils");
const {getRatings, getRatedById} = require("../../src/controllers/ratingController");
var router = express.Router();

const DEFAULT_LIMIT = 10
/**
 * gets all connections under a given bright id
 */
router.get('/', async function (req, res, next) {
    let brightId = req.signedCookies.brightId
    let password = req.signedCookies.password
    if (brightId === undefined || password === undefined) {
        throw new Error("Missing signed cookies")
    }

    let page = req.query.page && req.query.page > 0 ? req.query.page - 1 : 0;
    let limit = req.query.limit ? req.query.limit : DEFAULT_LIMIT;
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
    let endingIndex = startingIndex + limit

    let filteredConnections = await decryptedUserData.connections
        .filter(e => !reviewedIds.includes(e.id))
        .slice(startingIndex, endingIndex)
        .map(connection => {
            photoArray.push(pullProfilePhoto(key, connection.id, password))
                return {
                    "brightId": connection.id,
                    "name": connection.name
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
 * gets a specific connection
 */
router.get('/*', function (req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
