/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addColumns('ratings', {
    updatedAt: { type: 'timestamp', notNull: false },
  })
  pgm.sql(
    'UPDATE "ratings" as r1 SET "updatedAt"=(SELECT "createdAt" FROM "ratings" as r2 WHERE r1.id=r2.id)',
  )
  pgm.alterColumn('ratings', 'updatedAt', {
    default: pgm.func('current_timestamp'),
    notNull: true,
  })
}

exports.down = (pgm) => {
  pgm.dropColumns('ratings', 'updatedAt')
}
