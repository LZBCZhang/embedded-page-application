using EmbeddedPageApplication.Server.Models.Preferences;
using EmbeddedPageApplication.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace EmbeddedPageApplication.Server.Controllers;

[ApiController]
[Route("api/consent")]
public class ConsentController : ControllerBase
{
    private readonly IPreferencesService _preferences;

    public ConsentController(IPreferencesService preferences) => _preferences = preferences;

    // POST /api/consent/user-consents
    [HttpPost("user-consents")]
    public ActionResult<UserPreferencesResponse> GetUserConsents([FromBody] FetchUserPreferencesRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId) || string.IsNullOrWhiteSpace(request.CollectionPointId))
        {
            return BadRequest(new { message = "userId and collectionPointId are required." });
        }

        return Ok(_preferences.GetUserPreferences(request.UserId, request.CollectionPointId));
    }

    // POST /api/consent/update-user-consents
    [HttpPost("update-user-consents")]
    public IActionResult UpdateUserConsents([FromBody] UpdateUserPreferencesRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId) || string.IsNullOrWhiteSpace(request.CollectionPointId))
        {
            return BadRequest(new { message = "userId and collectionPointId are required." });
        }

        _preferences.UpdateUserPreferences(request);
        return Ok();
    }
}