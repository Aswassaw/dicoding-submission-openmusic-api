const _ = require("lodash");

module.exports = (object) => {
  const newObject = {};

  for (const property in object) {
    newObject[_.camelCase(`${property}`)] = object[property];
  }

  return newObject;
};
