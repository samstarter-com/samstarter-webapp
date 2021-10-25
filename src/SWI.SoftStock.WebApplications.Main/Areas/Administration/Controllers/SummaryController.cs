using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Administration.Controllers
{
    [Area("Administration")]
    [Route("administration/summary")]
    public class SummaryController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("details")]
        public PartialViewResult Details()
        {
            return PartialView();
        }
    }
}