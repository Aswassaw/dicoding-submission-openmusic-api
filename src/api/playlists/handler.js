const autoBind = require("auto-bind");

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { name } = request.payload;
    const { credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({
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

    const playlists = await this._playlistsService.getPlaylists({
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
    const { credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);

    return {
      status: "success",
      message: "Playlist berhasil dihapus",
    };
  }

  async postSongToPlaylist(request, h) {
    this._validator.validateSongPlaylistPayload(request.payload);
    const { credentialId } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    // mengecek apakah song exist
    await this._songsService.getSongById(songId);
    await this._playlistsService.addSongToPlaylist({
      playlistId: id,
      songId,
    });

    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan ke playlist",
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylist(request) {
    const { credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._playlistsService.getPlaylistById({
      playlistId: id,
      credentialId,
    });
    const songs = await this._playlistsService.getSongFromPlaylist(id);

    return {
      status: "success",
      data: {
        playlist: {
          ...playlist,
          songs,
        },
      },
    };
  }

  async deleteSongFromPlaylist(request) {
    this._validator.validateSongPlaylistPayload(request.payload);
    const { credentialId } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    // mengecek apakah song exist
    await this._songsService.getSongById(songId);
    await this._playlistsService.deleteSongFromPlaylist({
      playlistId: id,
      songId,
    });

    return {
      status: "success",
      message: "Lagu berhasil dihapus dari playlist",
    };
  }
}

module.exports = PlaylistsHandler;
