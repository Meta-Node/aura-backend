/* eslint-disable camelcase */
require('dotenv').config()
exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('brightIdKeys', {
        brightId: {
            type: 'varchar',
            notNull: true,
            unique: true,
            primaryKey: true
        },
        publicKey: {
            type: 'varchar',
            notNull: true
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })

    pgm.createTable('ratings', {
        id: "id",
        toBrightId: {
            type: 'varchar',
            notNull: true
        },
        fromBrightId: {
            type: 'varchar',
            notNull: true
        },
        rating: {
            type: 'json',
            notNull: true,
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })

    pgm.createTable('energyTransfer', {
        id: "id",
        toBrightId: {
            type: 'varchar',
            notNull: true
        },
        fromBrightId: {
            type: 'varchar',
            notNull: true
        },
        amount: {
            type: 'integer',
            notNull: true,
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })

    pgm.createTable('nicknames', {
        id: "id",
        toBrightId: {
            type: 'varchar',
            notNull: true
        },
        fromBrightId: {
            type: 'varchar',
            notNull: true
        },
        nickName: {
            type: 'varchar',
            notNull: true,
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })

    pgm.createTable('energy', {
        brightId: {
            type: 'varchar',
            notNull: true,
            primaryKey: true,
            unique: true
        },
        amount: {
            type: 'integer',
            notNull: true,
        },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })

    pgm.createIndex("ratings", "fromBrightId")
    pgm.createIndex("ratings", "toBrightId")
    pgm.createIndex("energyTransfer", "fromBrightId")
    pgm.createIndex("energyTransfer", "toBrightId")
    pgm.createIndex("nicknames", "fromBrightId")
}
