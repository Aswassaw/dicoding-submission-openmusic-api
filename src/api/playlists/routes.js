const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: {
      auth: "jwt_middleware",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
    options: {
      auth: "jwt_middleware",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: "jwt_middleware",
    },
  },
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postSongToPlaylist,
    options: {
      auth: "jwt_middleware",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getSongsFromPlaylist,
    options: {
      auth: "jwt_middleware",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deleteSongFromPlaylist,
    options: {
      auth: "jwt_middleware",
    },
  },
];

module.exports = routes;
