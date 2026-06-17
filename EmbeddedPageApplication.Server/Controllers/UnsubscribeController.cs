using EmbeddedPageApplication.Server.Models.Unsubscribe;
using Microsoft.AspNetCore.Mvc;

namespace EmbeddedPageApplication.Server.Controllers;

[ApiController]
[Route("api/public")]
public class UnsubscribeController : ControllerBase
{
    private readonly ILogger<UnsubscribeController> _logger;

    public UnsubscribeController(ILogger<UnsubscribeController> logger) => _logger = logger;

    // POST /api/public/unsubscribe
    [HttpPost("unsubscribe")]
    public IActionResult Unsubscribe([FromBody] UnsubscribeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token) || string.IsNullOrWhiteSpace(request.ConsentId))
        {
            return BadRequest(new { message = "token and consentId are required." });
        }

        // Stub: a real implementation would validate the token and revoke the consent.
        _logger.LogInformation("Unsubscribe request accepted for consent {ConsentId}", request.ConsentId);
        return Ok();
    }
}