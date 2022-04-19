/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("activityLog", {
        id: "id",
        toBrightId: {
            type: 'varchar',
            notNull: true
        },
        fromBrightId: {
            type: 'varchar',
            notNull: true
        },
        action: {
            type: 'json',
            notNull: true
        },
        timestamp: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        isImportant: {
            type: 'boolean',
            notNull: true,
            default: false
        }
    })

    pgm.createIndex("activityLog", "fromBrightId")
    pgm.createIndex("activityLog", "toBrightId")
};

exports.down = pgm => {
};
