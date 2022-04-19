const Process = require("process");
const {getEnergy} = require("./src/controllers/energyController");
require('dotenv').config()

let energyTeam = ["xqmMHQMnBdakxs3sXXjy7qVqPoXmhhwOt4c_z1tSPwM", "AsjAK5gJ68SMYvGfCAuROsMrJQ0_83ZS92xy94LlfIA"]
let numberOfIterations = 3
let startingEnergy = 100
let energyMap = new Map()
let finalEnergy = {}

async function Asyncfunction() {
    console.log(process.env)
    await energyTeam.map(async brightId => {
        let rows = (await getEnergy(brightId)).rows
        let currentEnergy = startingEnergy;
        rows.forEach(row => {
            if (row.amount === 0) {
                return;
            }
            let transfer = (row.amount / startingEnergy) * 100
            energyMap[row.toBrightId] = transfer
            currentEnergy -= transfer
        })
        finalEnergy[brightId] = currentEnergy
    })

    console.log(energyMap)

    while (numberOfIterations > 0) {
        let nextEnergy = new Map()
        energyMap.forEach(async (v, brightId) => {
            let rows = (await getEnergy(brightId)).rows
            let currentEnergy = energyMap[brightId];
            rows.forEach(row => {
                if (row.amount === 0) {
                    return;
                }
                let transfer = (row.amount / energyMap[brightId]) * 100
                if (nextEnergy.includes(row.toBrightId)) {
                    nextEnergy[row.toBrightId] += transfer
                } else {
                    nextEnergy[row.toBrightId] = transfer
                }
                currentEnergy -= transfer
            })
            finalEnergy[brightId] = currentEnergy
        })
        numberOfIterations--
    }
}

(async () => {
    try {
        await Asyncfunction()
    } catch(err) {
        console.error(err)
    }
})()