var express = require('express');
const {generateKey, pullDecryptedUserData, pullProfilePhoto} = require("../../src/utils/authUtils");
const {getRatings, getRatedById} = require("../../src/controllers/ratingController");
var router = express.Router();

const DEFAULT_LIMIT = 10

function validateTokens(req) {
    if (req.signedCookies.brightId === undefined || req.signedCookies.password === undefined) {
        throw new Error("Missing signed cookies")
    }
}

/**
 * gets all connections under a given bright id
 */
router.get('/', async function (req, res, next) {
    validateTokens(req)

    let brightId = req.signedCookies.brightId
    let password = req.signedCookies.password

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
router.get('/:brightId', function (req, res, next) {
    connectionId = req.params.brightId
    res.send('respond with a resource');

    validateTokens(req)

    let brightId = req.signedCookies.brightId
    let password = req.signedCookies.password

    ratings = getRatings(connectionId)


});


module.exports = router;
