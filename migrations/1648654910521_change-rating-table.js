/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.dropTable('ratings')
  pgm.createTable('ratings', {
    id: 'id',
    toBrightId: {
      type: 'varchar',
      notNull: true,
    },
    fromBrightId: {
      type: 'varchar',
      notNull: true,
    },
    rating: {
      type: 'decimal',
      notNull: true,
    },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  })

  pgm.createIndex('ratings', 'fromBrightId')
  pgm.createIndex('ratings', 'toBrightId')
}

exports.down = (pgm) => {}
