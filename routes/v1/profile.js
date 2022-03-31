const {getConnection} = require("../../src/controllers/connectionController");
const {rateConnection} = require("../../src/controllers/ratingController");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");

router.post('/:brightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.brightId;
});