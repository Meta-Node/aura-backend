const Model = require('../models/model')
const ratings = new Model('ratings')

// async function getRatings(brightId) {
//   return await ratings.select(
//     'score',
//     ` WHERE ratings.brightid = '${brightId}'`,
//   )
// }

async function getConnectionsRated(brightId) {
  return ratings.pool.query(
    'SELECT "toBrightId" from ratings WHERE "fromBrightId" = $1',
    [brightId],
  )
}

function rateConnection(fromBrightId, toBrightId, rating) {
  return ratings.pool.query(
    'Insert into "ratings"("fromBrightId", "toBrightId", "rating") values ($1, $2, $3) ON CONFLICT ("fromBrightId", "toBrightId") DO UPDATE SET "rating" = $3, "updatedAt" = current_timestamp',
    [fromBrightId, toBrightId, rating],
  )
}

function getNumberOfRatingsGiven(fromBightId) {
  return ratings.countRatingsGiven(fromBightId)
}

function getRating(fromBrightId, toBrightId) {
  return ratings.pool.query(
    'SELECT * from "ratings" WHERE "fromBrightId" = $1 AND "toBrightId" = $2',
    [fromBrightId, toBrightId],
  )
}

async function getRatingsReceived(brightId) {
  return ratings.pool.query(
    'SELECT * from "ratings" WHERE "toBrightId" = $1',
    [brightId],
  )
}

async function getAllRatingsGiven(brightId) {
  return ratings.pool.query(
    'SELECT * from "ratings" WHERE "fromBrightId" = $1',
    [brightId],
  )
}

async function getRatingsMap(brightId) {
  let ratings = await getAllRatingsGiven(brightId)
  let map = {}
  ratings = ratings.rows
  ratings.map((rating) => {
    map[rating.toBrightId] = rating.rating
  })
  return map
}

async function allRatings() {
  return ratings.pool.query(
    'SELECT "fromBrightId", "toBrightId", "rating" from "ratings"'
  );
}

module.exports = {
  getConnectionsRated,
  rateConnection,
  getNumberOfRatingsGiven,
  getRating,
  getAllRatingsGiven,
  getRatingsMap,
  getRatingsReceived,
  allRatings,
}
