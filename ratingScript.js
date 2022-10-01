const { Database } = require("arangojs");
const { getEnergy } = require('./src/controllers/energyController')
const { addEnergyHoldings } = require('./src/controllers/energyHoldingsController')
require('dotenv').config()

const arango = new Database({
  url: process.env.DB_URL,
});

const users = arango.collection("users");

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

  console.log('Writing results to database.')
  energyMap.forEach((energy, brightId) => {
    addEnergyHoldings(brightId, parseInt(energy))
  })
  console.log('Writing results to BrightID node.');
  let updates = [];
  energyMap.forEach((energy, brightId) => {
    updates.push({
      "_key": brightId,
      energy
    })
  });
  console.log(updates);
  await users.updateAll(updates);
  console.log('Done.');
}

;(async () => {
  try {
    await Asyncfunction()
  } catch (err) {
    console.error(err)
  }
})()
