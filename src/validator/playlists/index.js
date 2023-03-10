const InvariantError = require("../../exceptions/InvariantError");
const { PostPlaylistSchema, ChangeSongOnPlaylistSchema } = require("./schema");

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PostPlaylistSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongPlaylistPayload: (payload) => {
    const validationResult = ChangeSongOnPlaylistSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
