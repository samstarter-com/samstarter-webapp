using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Management.Controllers
{
    [Area("Management")]
    [Route("management/licensing")]
    public class LicensingController : Controller
    {
        [HttpGet]
        [Route("licensemachine")]
        public ActionResult LicenseMachine()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("unlicensemachine")]
        public ActionResult UnLicenseMachine()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("licensemachines")]
        public ActionResult LicenseMachines()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("unlicensemachines")]
        public ActionResult UnLicenseMachines()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("licenselicenses")]
        public ActionResult LicenseLicenses()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("unlicenselicenses")]
        public ActionResult UnLicenseLicenses()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("licensesoftware")]
        public ActionResult LicenseSoftware()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("unlicensesoftware")]
        public ActionResult UnLicenseSoftware()
        {
            return PartialView();
        }
    }
}