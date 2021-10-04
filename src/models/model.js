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
        const text = 'INSERT INTO rating(brightId, score, from_brightId, date, version) VALUES($1, $2, $3, $4, $5) RETURNING *'

        return this.pool.query(
            text,
            {
                "brightId": brightId,
                "score": score,
                "from_brightId": from_brightId,
                "date": Date.now(),
                "version": 1
            });
    }
}

module.exports = Model