/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("albums", {
    cover_url: {
      type: "VARCHAR(250)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("albums", "cover_url");
};
