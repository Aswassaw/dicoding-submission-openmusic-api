const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(albumsService, storageService, validator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._albumsService.addAlbum({ name, year });

    const response = h.response({
      status: "success",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);
    const songs = await this._albumsService.getSongsByAlbumId(id);

    return {
      status: "success",
      data: {
        album: {
          ...album,
          songs,
        },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;

    await this._albumsService.editAlbumById(id, { name, year });

    return {
      status: "success",
      message: "Album berhasil diperbarui",
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._albumsService.deleteAlbumById(id);

    return {
      status: "success",
      message: "Album berhasil dihapus",
    };
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const { id } = request.params;

    const fileLocation = await this._storageService.writeFile(
      cover,
      cover.hapi
    );
    await this._albumsService.editAlbumCoverUrl(id, fileLocation);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }

  async postLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(id);
    const likeStatus = await this._albumsService.verifyAlbumAlreadyLiked(
      credentialId,
      id
    );

    if (likeStatus.length) {
      await this._albumsService.unlikeAlbum(credentialId, id);
    } else {
      await this._albumsService.likeAlbum(credentialId, id);
    }

    const response = h.response({
      status: "success",
      message: likeStatus.length
        ? "Berhasil batal menyukai album"
        : "Berhasil menyukai album",
    });
    response.code(201);
    return response;
  }

  async getCountLikeAlbumHandler(request, h) {
    const { id } = request.params;

    const likeCount = await this._albumsService.getCountAlbumLike(id);

    const response = h.response({
      status: "success",
      data: {
        likes: parseInt(likeCount.data.count, 10),
      },
    });
    if (likeCount.source === "cache") {
      response.headers = {
        "X-Data-Source": "cache",
      };
    }
    return response;
  }
}

module.exports = AlbumsHandler;
