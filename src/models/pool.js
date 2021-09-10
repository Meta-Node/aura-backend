var Pool = require('pg-pool')

const pool = new Pool({connectionString: process.env.URI, ssl : true});

module.exports = pool