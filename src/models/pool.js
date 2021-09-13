var Pool = require('pg-pool')

const pool = new Pool({connectionString: process.env.URI, ssl: { rejectUnauthorized: false }});

module.exports = pool