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
    path: "/playlists",
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: "jwt_middleware",
    },
  },
];

module.exports = routes;
