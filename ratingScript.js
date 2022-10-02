const { Database } = require("arangojs");
const { getEnergy } = require('./src/controllers/energyController')
const { addEnergyHoldings } = require('./src/controllers/energyHoldingsController')
const { allRatings } = require('./src/controllers/ratingController');
require('dotenv').config()

const arango = new Database({
  url: process.env.DB_URL,
});

const users = arango.collection("users");
const connections = arango.collection("connections");

const energyTeam = [
  'xqmMHQMnBdakxs3sXXjy7qVqPoXmhhwOt4c_z1tSPwM',
  'AsjAK5gJ68SMYvGfCAuROsMrJQ0_83ZS92xy94LlfIA',
]
const startingEnergy = 100000;
const hops = 4;

let hopsLeft = hops;
let energyMap = new Map()

async function Asyncfunction() {
  for (const brightId of energyTeam) {
    energyMap.set(brightId, startingEnergy)
  }

  while (hopsLeft) {
    console.log(
      `Remaining hops: ${hopsLeft}. Nodes: ${energyMap.size}`,
    )
    const nextEnergy = new Map()
    for (const [brightId, currentEnergy] of energyMap.entries()) {
      if (!currentEnergy) {
        continue
      }
      let rows = (await getEnergy(brightId)).rows
      rows.forEach((row) => {
        let transfer = currentEnergy * (row.amount / row.scale)
        const energy = (nextEnergy.get(row.toBrightId) || 0) + transfer
        nextEnergy.set(row.toBrightId, energy)
      })
    }
    --hopsLeft;
    energyMap = nextEnergy
  }

  console.log('Writing energy to postgres.')
  energyMap.forEach((energy, brightId) => {
    addEnergyHoldings(brightId, parseInt(energy))
  })
  console.log('Writing energy to BrightID node.');
  let updates = [];
  energyMap.forEach((energy, brightId) => {
    updates.push({
      "_key": brightId,
      energy
    })
  });
  console.log(updates);
  await users.updateAll(updates);
  console.log('Done writing energy.');

  console.log('Reading honesty ratings from postgres.');
  let honesty = await allRatings();
  updates = [];
  honesty.rows.forEach((row) => {
    updates.push({
      "_from": `users/${row.fromBrightId}`,
      "_to": `users/${row.toBrightId}`,
      "honesty": row.rating
    });
  })
  console.log('Writing honesty ratings to BrightID node.');
  await connections.import(updates, {
    "onDuplicate": "update"
  });
  console.log('Done writing honesty ratings.');
}

;(async () => {
  try {
    await Asyncfunction()
  } catch (err) {
    console.error(err)
  }
})()
