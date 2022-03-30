var Pool = require('pg-pool')

const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});

module.exports = pool