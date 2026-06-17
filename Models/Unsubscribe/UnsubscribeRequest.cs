namespace EmbeddedPageApplication.Server.Models.Unsubscribe;

// Mirrors src/features/unsubscribe/types/unsubscribe.types.ts (UnsubscribePayload).
public class UnsubscribeRequest
{
    public string Token { get; set; } = string.Empty;
    public string ConsentId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}