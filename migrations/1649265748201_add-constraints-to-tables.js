/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addConstraint("energyTransfer", "energy_unique", `UNIQUE ("fromBrightId", "toBrightId")`)
    pgm.addConstraint("nicknames", "nickname_unique", `UNIQUE ("fromBrightId", "toBrightId")`)
};

exports.down = pgm => {};
