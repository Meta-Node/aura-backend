const { Database , aql } = require("arangojs");
const Model = require('../models/model')
const ratings = new Model('ratings')

require('dotenv').config();

const arango = new Database({
  url: process.env.DB_URL,
});

const honesty = arango.collection("honesty");

async function getConnectionsRated(brightId) {
  return ratings.pool.query(
    'SELECT "toBrightId" from ratings WHERE "fromBrightId" = $1',
    [brightId],
  )
}

async function rateConnection(from, to, honestyRating) {
  await arango.query(aql`
    upsert { _to: users/${to}, _from: users/${from} }
    insert { _to: users/${to}, _from: users/${from}, modified: DATE_NOW(), honesty: ${honestyRating} }
    update { modified: DATE_NOW(), honesty: ${honestyRating} }
    in ${honesty}
  `);
  return ratings.pool.query(
    'Insert into "ratings"("fromBrightId", "toBrightId", "rating") values ($1, $2, $3) ON CONFLICT ("fromBrightId", "toBrightId") DO UPDATE SET "rating" = $3, "updatedAt" = current_timestamp',
    [from, to, honestyRating],
  )
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
  getRating,
  getAllRatingsGiven,
  getRatingsMap,
  getRatingsReceived,
  allRatings,
}
