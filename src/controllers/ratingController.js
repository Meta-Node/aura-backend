const { aql } = require("arangojs");
const { arango } = require("../models/pool.js");
const Model = require('../models/model')
const ratings = new Model('ratings')
const { deleteEnergyAllocation } = require("./energyAllocationController");

const honesty = arango.collection("honesty");
const energyAllocation = arango.collection("energyAllocation");

async function getConnectionsRated(brightId) {
  return ratings.pool.query(
    'SELECT "toBrightId" from ratings WHERE "fromBrightId" = $1',
    [brightId],
  )
}

async function rateConnection(from, to, honestyRating) {
  const energyFrom = 'energy/' + from;
  const energyTo = 'energy/' + to;
  const userTo = 'users/' + to;
  await arango.query(aql`
    let removeEnergy = (
      for e in ${energyAllocation}
        filter ${honestyRating} < 1
        filter e._from == ${energyFrom}
        filter e._to == ${energyTo}
        update e with { modified: DATE_NOW(), allocation: 0 } in ${energyAllocation}
    )
  
    upsert { _to: ${userTo}, _from: ${energyFrom} }
    insert { _to: ${userTo}, _from: ${energyFrom}, modified: DATE_NOW(), honesty: ${honestyRating} }
    update { modified: DATE_NOW(), honesty: ${honestyRating} }
    in ${honesty}
  `);
  if (honestyRating < 1){
    await deleteEnergyAllocation(from, to);
  }
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
