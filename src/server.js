require("dotenv").config();

const Hapi = require("@hapi/hapi");
const albums = require('./api/albums')
const AlbumsValidator = require('./validator/albums')
const AlbumsService = require("./services/postgres/AlbumsService");
const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const albumsService = new AlbumsService();

  // server configuration
  const server = Hapi.server({
    port: process.env.PORT || 5100,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // root endpoint
  server.route([
    {
      method: "GET",
      path: "/",
      handler: (req, h) => {
        return {
          status: "success",
          message: "Web Service Online",
        };
      },
    },
  ]);

  // all plugin
  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    }
  })

  // error handler
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
