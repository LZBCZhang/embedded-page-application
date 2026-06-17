namespace EmbeddedPageApplication.Server.Models.Preferences;

// Request/response contracts mirroring the TypeScript API types.

public class FetchUserPreferencesRequest
{
    public string UserId { get; set; } = string.Empty;
    public string CollectionPointId { get; set; } = string.Empty;
}

public class ResponseMeta
{
    public string CorrelationId { get; set; } = string.Empty;
}

public class UserPreferencesResponse
{
    public ResponseMeta Meta { get; set; } = new();
    public List<Purpose> Data { get; set; } = new();
}

public class AdditionalInfo
{
    public string Email { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;
    public string Mobile { get; set; } = string.Empty;
}

public class PurposeUpdate
{
    public string PurposeId { get; set; } = string.Empty;

    // "CONFIRMED" | "WITHDRAWN"
    public string Status { get; set; } = "CONFIRMED";

    // Ids/types of the communication preferences the user has consented to.
    public List<string> CommunicationPreferences { get; set; } = new();
}

public class UpdateUserPreferencesRequest
{
    public string UserId { get; set; } = string.Empty;
    public string CollectionPointId { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public List<PurposeUpdate> Purposes { get; set; } = new();
    public AdditionalInfo? AdditionalInfo { get; set; }
}