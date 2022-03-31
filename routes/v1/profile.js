const {getConnection} = require("../../src/controllers/connectionController");
const {rateConnection} = require("../../src/controllers/ratingController");
const {validateAuraPlayer} = require("../../src/middlewear/aurahandler");


//needs 4 to be rated
//aura time
// number of connection
router.post('/:brightId', validateAuraPlayer, async function (req, res, next) {
    let fromBrightId = req.params.brightId;
});