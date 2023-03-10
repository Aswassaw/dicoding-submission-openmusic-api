const autoBind = require("auto-bind");

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: "success",
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { credentialId } = request.auth.credentials;

    const playlists = await this._service.getPlaylists({
      owner: credentialId,
    });

    return {
      status: "success",
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { credentialId: owner } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, owner);
    await this._service.deletePlaylistById(id);

    return {
      status: "success",
      message: "Playlist berhasil dihapus",
    };
  }
}

module.exports = PlaylistsHandler;
