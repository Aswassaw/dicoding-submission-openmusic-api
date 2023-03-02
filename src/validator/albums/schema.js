const Joi = require("joi");

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().max(495),
  year: Joi.number().required(),
});

module.exports = { AlbumPayloadSchema };
