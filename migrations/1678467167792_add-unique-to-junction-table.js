/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    "collaborations",
    "unique-playlist_id-and-user_id",
    "UNIQUE(playlist_id, user_id)"
  );

  pgm.addConstraint(
    "playlist_songs",
    "unique-playlist_id-and-song_id",
    "UNIQUE(playlist_id, song_id)"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("collaborations", "unique-playlist_id-and-user_id");
  pgm.dropConstraint("playlist_songs", "unique-playlist_id-and-song_id");
};
