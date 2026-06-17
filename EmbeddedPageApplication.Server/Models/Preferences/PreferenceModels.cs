namespace EmbeddedPageApplication.Server.Models.Preferences;

// Mirrors src/features/preferences/types/preferences.types.ts.
// System.Text.Json (web defaults) serializes these PascalCase properties as camelCase.

public class NotificationOption
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool Consented { get; set; }
}

public class CommunicationPreference
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public List<NotificationOption> Options { get; set; } = new();
}

public class OtherPreference
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public List<NotificationOption> Options { get; set; } = new();
}

public class Purpose
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // "CONFIRMED" | "WITHDRAWN"
    public string Status { get; set; } = "CONFIRMED";
    public int Version { get; set; }
    public string PurposeType { get; set; } = string.Empty;
    public List<CommunicationPreference> CommunicationPreferences { get; set; } = new();
    public List<OtherPreference> OtherPreferences { get; set; } = new();
}