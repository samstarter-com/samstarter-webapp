using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Management.Controllers
{
    [Area("Management")]
    [Route("management/observables")]
    public class ObservableController : Controller
    {

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("details")]
        public ActionResult Details()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("list")]
        public ActionResult List()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("machine")]
        public ActionResult Machine()
        {
            return View();
        }

        [HttpGet]
        [Route("machinelist")]
        public ActionResult MachineList()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("append")]
        public ActionResult Append()
        {
            return PartialView();
        }


        [HttpGet]
        [Route("remove")]
        public ActionResult Remove()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("add")]
        public ActionResult Add()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("delete")]
        public ActionResult Delete()
        {
            return PartialView();
        }
    }
}