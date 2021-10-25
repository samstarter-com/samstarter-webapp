using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Personal.Controllers
{
    [Area("Personal")]
    [Route("personal/machines")]
    public class PersonalMachineController : Controller
    {
        [HttpGet]
        [Route("")]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("machines")]
        public ActionResult Machines()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("list")]
        public ActionResult List()
        {
            return PartialView();
        }
    }
}