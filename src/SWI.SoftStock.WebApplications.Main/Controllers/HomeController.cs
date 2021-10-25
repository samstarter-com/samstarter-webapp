using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Landing()
        {
            return PartialView();
        }

        public ActionResult ThankYouPage()
        {
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }

        public ActionResult Docs()
        {
            return View();
        }

        public ActionResult Start()
        {
            return RedirectAuthenticated();
        }

        public ActionResult Join()
        {
            return RedirectAuthenticated();
        }

        private ActionResult RedirectAuthenticated()
        {
            var isAuthenticated = HttpContext.User.Identity.IsAuthenticated;
            if (isAuthenticated)
            {
                return RedirectToRoute(new { area = "Personal", controller = "PersonalMachine", action = "Index" });
            }
            return View();
        }
    }
}