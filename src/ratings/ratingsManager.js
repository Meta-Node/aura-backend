

const arr = [-100, -75, -50, -25, 0, 25, 50, 75, 100];

function generateRatings(brightId) {
    if(brightId === "I1Hz9L532aMra_RdzxUPh46bqrj4LUuHwuvSPLBwWbE" || brightId === "bDLh7MOFR6gM5_5AFCwsOJCh756gXfVkI8YJe2b9bgc") {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    return 0;
}

module.exports = {generateRatings}