const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");
const express = require("express");
const {getAllAfter, getAllAfterForBrightId, updateIsImportant} = require("../../src/controllers/activityLogController");
var router = express.Router();

router.get('/detail/:fromBrightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.fromBrightId
    let limit = req.query.limit ? req.query.limit : 20
    let timestamp = req.query.timestamp ? req.query.timestamp : Date.now()

    res.json({
        events: (await getAllAfterForBrightId(timestamp, limit, fromBrightId)).rows
    })
});

router.get("/general", async function (req, res, next) {
    let limit = req.query.limit ? req.query.limit : 20
    let timestamp = req.query.timestamp ? req.query.timestamp : Date.now()
    let rows = (await getAllAfter(timestamp, limit)).rows
    res.json({
        events: rows
    })
});

router.post("/:logId", async function (req, res, next) {
    let logId = req.params.logId
    let isImportant = req.body.isImportant
    if (!logId || isImportant === undefined) {
        res.status(500).send("Need log id")
    }

    await updateIsImportant(logId, isImportant)
    res.status(204).send()
})

module.exports = router