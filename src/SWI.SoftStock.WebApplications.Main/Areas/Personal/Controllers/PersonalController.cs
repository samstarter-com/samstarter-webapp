using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Personal.Controllers
{
    [Area("Personal")]
    [Route("personal")]
    public class PersonalController : Controller
    {
        [HttpGet]
        [Route("")]
        public ActionResult Index()
        {
            return View();
        }
    }
}