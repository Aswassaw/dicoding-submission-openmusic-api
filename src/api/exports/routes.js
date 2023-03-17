const routes = (handler) => [
  {
    method: "POST",
    path: "/export/playlists/{playlistId}",
    handler: handler.postExportNotesHandler,
    options: {
      auth: "jwt_middleware",
    },
  },
];

module.exports = routes;
