var express = require('express');
const {getConnection} = require("../../src/controllers/connectionController");
const {getRating} = require("../../src/controllers/ratingController");
var router = express.Router();

router.get('/:fromBrightId/:toBrightId', async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId;
    let toBrightId = req.params.toBrightId;

    let connection = (await getConnection(fromBrightId, toBrightId))[0];
    if(connection === undefined) {
        res.status(500).send("No connection between these two brightId");
    }
    let rating = (await getRating(fromBrightId, toBrightId)).rows

    res.json({
        previousRating: rating[0],

    })
});



module.exports = router;