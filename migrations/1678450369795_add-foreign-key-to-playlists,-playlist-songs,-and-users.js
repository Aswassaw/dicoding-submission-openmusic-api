/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addConstraint(
    "playlists",
    "fk-playlists.owner-users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "playlist_songs",
    "fk-playlist_songs.playlist_id-playlists.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "playlist_songs",
    "fk-playlist_songs.song_id-songs.id",
    "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE"
  );
};

exports.down = pgm => {
  pgm.dropConstraint("playlists", "fk-playlists.owner-users.id");
  pgm.dropConstraint("playlist_songs", "fk-playlist_songs.playlist_id-playlists.id");
  pgm.dropConstraint("playlist_songs", "fk-playlist_songs.song_id-songs.id");
};
