require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Inert = require("@hapi/inert");
// albums
const albums = require("./api/albums");
const AlbumsValidator = require("./validator/albums");
const AlbumsService = require("./services/postgres/AlbumsService");
// songs
const songs = require("./api/songs");
const SongsValidator = require("./validator/songs");
const SongsService = require("./services/postgres/SongsService");
// users
const users = require("./api/users");
const UsersValidator = require("./validator/users");
const UsersService = require("./services/postgres/UsersService");
// authentications
const authentications = require("./api/authentications");
const AuthenticationsValidator = require("./validator/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
// playlists
const playlists = require("./api/playlists");
const PlaylistsValidator = require("./validator/playlists");
const PlaylistsService = require("./services/postgres/PlaylistsService");
// collaborations
const collaborations = require("./api/collaborations");
const CollaborationsService = require("./services/postgres/CollaborationsService");
const CollaborationsValidator = require("./validator/collaborations");
// activities
const activities = require("./api/activities");
const ActivitiesService = require("./services/postgres/ActivitiesService");
// exports
const _exports = require("./api/exports");
const ProducerService = require("./services/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/exports");
// uploads
const StorageService = require("./services/s3storage/StorageService");
// cache
const CacheService = require('./services/rediscache/CacheService');

const ClientError = require("./exceptions/ClientError");
const config = require("./utils/config");

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService(cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const activitiesService = new ActivitiesService();
  const storageService = new StorageService();

  // server configuration
  const server = Hapi.server({
    port: config.app.port || 5000,
    host: config.app.host || "localhost",
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
      handler: () => ({
        status: "success",
        message: "Web Service Online",
      }),
    },
  ]);

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy("jwt_middleware", "jwt", {
    keys: config.jwt.accessToken,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.expired,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        credentialId: artifacts.decoded.payload.userId,
      },
    }),
  });

  // all plugin
  await server.register([
    {
      plugin: albums,
      options: {
        albumsService,
        storageService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        validator: AuthenticationsValidator,
        usersService,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        songsService,
        activitiesService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: activities,
      options: {
        activitiesService,
        playlistsService,
      },
    },
    {
      plugin: _exports,
      options: {
        playlistsService,
        exportsService: ProducerService,
        validator: ExportsValidator,
      },
    },
  ]);

  // error handler
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      console.log(response.message);

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
