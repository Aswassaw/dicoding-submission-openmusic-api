const Joi = require("joi");

const PostPlaylistSchema = Joi.object({
  name: Joi.string().required().max(495),
});

const ChangeSongOnPlaylistSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PostPlaylistSchema, ChangeSongOnPlaylistSchema };
