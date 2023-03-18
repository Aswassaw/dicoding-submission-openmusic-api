const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: handler.postAlbumHandler,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
  },
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: handler.postUploadAlbumCoverHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        output: "stream",
        maxBytes: 512000,
        multipart: true,
      },
    },
  },
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postLikeAlbumHandler,
    options: {
      auth: "jwt_middleware",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.getCountLikeAlbumHandler,
  },
];

module.exports = routes;
