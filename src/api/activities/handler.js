const autoBind = require("auto-bind");

class ActivitiesHandler {
  constructor(activitiesService, playlistsService) {
    this._activitiesService = activitiesService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getActivitiesHandler(request) {
    const { credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._playlistsService.checkPlaylistExist(id);
    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const activities = await this._activitiesService.getActivities(id);

    return {
      status: "success",
      data: {
        playlistId: id,
        activities,
      },
    };
  }
}

module.exports = ActivitiesHandler;
