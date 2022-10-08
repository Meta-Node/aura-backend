var Pool = require('pg-pool')
const { Database } = require("arangojs");
require('dotenv').config()

const arango = new Database({
  url: process.env.DB_URL,
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

module.exports = {
  pool,
  arango,
}
