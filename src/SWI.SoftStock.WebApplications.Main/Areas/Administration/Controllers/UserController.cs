using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Administration.Controllers

{
    [Area("Administration")]
    [Route("administration/users")]
    public class UserController : Controller
    {

        [HttpGet]
        [Route("")]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("list")]
        public PartialViewResult List()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("details")]
        public PartialViewResult Details()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("changerole")]
        public ActionResult ChangeRole()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("update")]
        public ActionResult Update()
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

        [HttpGet]
        [Route("unlock")]
        public ActionResult UnLock()
        {
            return PartialView();
        }
    }
}