const Joi = require("joi");

const SongPayloadSchema = Joi.object({
  title: Joi.string().required().max(495),
  year: Joi.number().required(),
  genre: Joi.string().required().max(495),
  performer: Joi.string().required().max(495),
  duration: Joi.number(),
  albumId: Joi.string(),
});

module.exports = { SongPayloadSchema };
