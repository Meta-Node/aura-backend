var Pool = require('pg-pool')

console.log(process.env.DATABASE_URL)
const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

module.exports = pool