using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Personal.Controllers
{
    [Area("Personal")]
    [Route("personal/softwares")]
    public class PersonalSoftwareController : Controller
    {
        [HttpGet]
        [Route("")]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("list")]
        public ActionResult List()
        {
            return PartialView();
        }
    }
}