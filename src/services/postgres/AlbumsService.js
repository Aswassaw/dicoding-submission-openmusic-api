const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const convertAllPropToCamel = require("../../utils/convertAllPropToCamel");

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  // albums
  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT id, name, year, cover_url FROM albums WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    return convertAllPropToCamel(result.rows[0]);
  }

  async getSongsByAlbumId(id) {
    const query = {
      text: "SELECT id, title, performer FROM songs WHERE album_id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE albums SET name=$1, year=$2, updated_at=$3 WHERE id=$4 RETURNING id",
      values: [name, year, updatedAt, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }

    return result.rows[0].id;
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id=$1 RETURNING id",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus album. Id tidak ditemukan");
    }

    return result.rows[0].id;
  }

  async editAlbumCoverUrl(id, coverUrl) {
    const query = {
      text: "UPDATE albums SET cover_url=$1 WHERE id=$2 RETURNING id",
      values: [coverUrl, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal memperbarui cover album. Id tidak ditemukan"
      );
    }
  }

  // user_album_likes
  async verifyAlbumAlreadyLiked(userId, albumId) {
    const query = {
      text: "SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);

    return result.rows;
  }

  async likeAlbum(userId, albumId) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async unlikeAlbum(userId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  async getCountAlbumLike(albumId) {
    try {
      // mendapatkan data like dari cache
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      return {
        source: "cache",
        data: JSON.parse(result),
      };
    } catch (error) {
      const query = {
        text: "SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };
      const result = await this._pool.query(query);

      // menyimpan data like ke cache
      await this._cacheService.set(
        `album-likes:${albumId}`,
        JSON.stringify(result.rows[0])
      );

      return {
        source: "db",
        data: result.rows[0],
      };
    }
  }
}

module.exports = AlbumsService;
