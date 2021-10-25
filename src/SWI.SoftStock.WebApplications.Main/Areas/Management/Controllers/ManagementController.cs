using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Management.Controllers
{
    [Area("Management")]
    [Route("management")]
    public class ManagementController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}