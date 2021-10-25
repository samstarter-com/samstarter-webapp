using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
