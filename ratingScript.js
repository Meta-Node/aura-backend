const Process = require('process')
const { getEnergy } = require('./src/controllers/energyController')
const {
  addEnergyHoldings,
} = require('./src/controllers/energyHoldingsController')
require('dotenv').config()

let energyTeam = [
  'xqmMHQMnBdakxs3sXXjy7qVqPoXmhhwOt4c_z1tSPwM',
  'AsjAK5gJ68SMYvGfCAuROsMrJQ0_83ZS92xy94LlfIA',
]
let numberOfIterations = 4
let startingEnergy = 100000
let energyMap = new Map()

async function Asyncfunction() {
  for (const brightId of energyTeam) {
    energyMap.set(brightId, startingEnergy)
  }

  while (numberOfIterations > 0) {
    console.log(
      `remained iterations: ${numberOfIterations}, nodes: ${energyMap.size}`,
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
    numberOfIterations--
    energyMap = nextEnergy
  }

  console.log('writting results in database ...')
  energyMap.forEach((energy, brightId) => {
    addEnergyHoldings(brightId, parseInt(energy))
  })
}

;(async () => {
  try {
    await Asyncfunction()
  } catch (err) {
    console.error(err)
  }
})()
