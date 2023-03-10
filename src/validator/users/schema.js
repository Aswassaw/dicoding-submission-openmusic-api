const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  username: Joi.string().required().max(45),
  password: Joi.string().required().max(495),
  fullname: Joi.string().required().max(495),
});

module.exports = { UserPayloadSchema };
