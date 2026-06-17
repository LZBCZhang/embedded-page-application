using EmbeddedPageApplication.Server.Models.Preferences;

namespace EmbeddedPageApplication.Server.Services;

public interface IPreferencesService
{
    UserPreferencesResponse GetUserPreferences(string userId, string collectionPointId);

    void UpdateUserPreferences(UpdateUserPreferencesRequest request);
}