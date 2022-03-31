var express = require('express');
const {getConnection, getConnections} = require("../../src/controllers/connectionController");
const {getRating, getConnectionsRated} = require("../../src/controllers/ratingController");
const {getSpecificEnergy} = require("../../src/controllers/energyController");
const shuffleSeed = require('shuffle-seed');
var router = express.Router();

router.get('/:fromBrightId/:toBrightId', async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId;
    let toBrightId = req.params.toBrightId;

    let connection = (await getConnection(fromBrightId, toBrightId))[0];
    if (connection === undefined) {
        res.status(500).send("No connection between these two brightId");
    }
    let rating = (await getRating(fromBrightId, toBrightId)).rows[0]
    let energyTransfer = (await getSpecificEnergy(fromBrightId, toBrightId)).rows[0]

    res.json({
        previousRating: rating,
        energyAllocated: energyTransfer,
        connectedTimestamp: connection.conn.timestamp
    })
});

router.get('/search', normalizeQueryParams, async function (req, res, next) {
    let connections = await getConnections(req.body.fromBrightId)
    let ratings
    if (!req.body.includeRated) {
        ratings = (await getConnectionsRated(req.body.fromBrightId)).rows
    }
    if (ratings) {
        connections = connections.filter(connection => {
            !ratings.includes(connection._key)
        })
    }
    let resp = shuffleSeed.shuffle(connections, req.body.seed)
        .slice(req.body.offset, req.body.offset);

    res.json({
        "connections": resp
    })

});


async function normalizeQueryParams(req, res, next) {
    let offset = req.query.offset ? req.query.offset : 0
    let limit = req.query.limit ? req.query.limit : 20
    let includeRated = req.query.includeRated ? req.query.includeRated : false
    let fromBrightId = req.query.fromBrightId

    if (req.query.seed === undefined) {
        return res.status(500).send("need to include seed")
    }

    if (fromBrightId === undefined) {
        return res.status(500).send("need to include fromBrightId")
    }

    req.body.offset = offset
    req.body.limit = limit
    req.body.includeRated = includeRated
    req.body.fromBrightId = fromBrightId
    req.body.seed = req.query.seed

    next()
}


module.exports = router;