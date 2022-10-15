const { Database } = require("arangojs");
const { allRatings } = require('./src/controllers/ratingController');
require('dotenv').config()

const arango = new Database({
  url: process.env.DB_URL,
});

const honesty = arango.collection("honesty");

async function Asyncfunction() {
  console.log('Reading honesty ratings from postgres.');
  let honestyRatings = await allRatings();
  let updates = [];
  honestyRatings.rows.forEach((row) => {
    updates.push({
      "_from": `energy/${row.fromBrightId}`,
      "_to": `users/${row.toBrightId}`,
      "honesty": Number(row.rating)
    });
  })
  console.log('Writing honesty ratings to BrightID node.');
  await honesty.import(updates, {
    "overwrite": true
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
