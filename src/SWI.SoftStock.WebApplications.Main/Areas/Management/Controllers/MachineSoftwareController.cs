using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Management.Controllers
{
    [Area("Management")]
    [Route("management/machine/softwares")]
    public class MachineSoftwareController : Controller
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
    }
}