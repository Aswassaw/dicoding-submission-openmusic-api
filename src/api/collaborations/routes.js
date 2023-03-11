const routes = (handler) => [
  {
    method: "POST",
    path: "/collaborations",
    handler: handler.postCollaborationHandler,
    options: {
      auth: "jwt_middleware",
    },
  },
  {
    method: "DELETE",
    path: "/collaborations",
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: "jwt_middleware",
    },
  },
];

module.exports = routes;
