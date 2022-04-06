/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addConstraint("ratings", "one_per_bright", `UNIQUE ("fromBrightId", "toBrightId")`)
};

exports.down = pgm => {};
