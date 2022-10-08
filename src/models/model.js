const { pool } = require('./pool')

class Model {
    constructor(table) {
        this.pool = pool;
        this.table = table;
        this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
    }
// Doesn't seem to work:
    // async select(columns, clause) {
    //     let query = `SELECT ${columns} FROM ${this.table}`;
    //     if (clause) query += clause;
    //     return this.pool.query(query);
    // }

    async countRatingsGiven(fromBrightId) {
        let query = 'SELECT COUNT(*) FROM ' + this.table + ' where from_brightId = $1'
        return this.pool.query(query, [fromBrightId]);
    }
}

module.exports = Model