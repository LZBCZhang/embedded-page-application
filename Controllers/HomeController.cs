using Microsoft.AspNetCore.Mvc;

namespace EmbeddedPageApplication.Server.Controllers;

public class HomeController : Controller
{
    [Route("Home/Error")]
    public IActionResult Error() => Problem();
}