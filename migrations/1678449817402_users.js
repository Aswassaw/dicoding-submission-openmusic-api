/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    username: {
      type: "VARCHAR(50)",
      unique: true,
      notNull: true,
    },
    password: {
      type: "VARCHAR(500)",
      notNull: true,
    },
    fullname: {
      type: "VARCHAR(500)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
