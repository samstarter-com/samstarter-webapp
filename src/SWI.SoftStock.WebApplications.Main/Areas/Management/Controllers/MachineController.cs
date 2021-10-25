using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Management.Controllers
{
    [Area("Management")]
    [Route("management/machines")]
    public class MachineController : Controller
    {
        [HttpGet]
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

        [HttpGet]
        [Route("details")]
        public ActionResult Details()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("linktostructureunit")]
        public ActionResult LinkToStructureUnit()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("linktouser")]
        public ActionResult LinkToUser()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("delete")]
        public ActionResult Delete()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("disable")]
        public ActionResult Disable()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("enable")]
        public ActionResult Enable()
        {
            return PartialView();
        }
    }
}