const pool = require('./pool')

class Model {
    constructor(table) {
        this.pool = pool;
        this.table = table;
        this.pool.on('error', (err, client) => `Error, ${err}, on idle client${client}`);
    }

    async select(columns, clause) {
        let query = `SELECT ${columns} FROM ${this.table}`;
        if (clause) query += clause;
        return this.pool.query(query);
    }

    async insert(brightId, score, from_brightId) {
        const text = 'INSERT INTO ratings(brightId, score, from_brightId, date, version)' +
            ' VALUES($1, $2, $3, $4, $5) ON CONFLICT (brightid,from_brightid)' +
            ' DO UPDATE SET score = $2'

        return this.pool.query(
            text,
            [
                brightId,
                score,
                from_brightId,
                Date.now(),
                1
            ]);
    }
}

module.exports = Model