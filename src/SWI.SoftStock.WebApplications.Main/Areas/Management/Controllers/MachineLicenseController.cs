using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Management.Controllers
{
    [Area("Management")]
    [Route("management/machine/licenses")]
    public class MachineLicenseController : LicenseMachineControllerBase
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
            var statuses = LicensedMachineFilterTypes();
            ViewBag.Statuses = statuses;
            return PartialView();
        }
    }
}