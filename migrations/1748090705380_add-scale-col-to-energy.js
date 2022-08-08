/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.addColumns('energyTransfer', {
    scale: { type: 'integer', notNull: true, default: 100 },
  })
}

exports.down = (pgm) => {}
