using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Controllers
{
    [Route("account")]
    public class AccountController : Controller
    {
        [Route("login")]
        public ActionResult Login()
        {
            return PartialView();
        }

        [Route("logoff")]
        public ActionResult LogOff()
        {
            return RedirectToAction("Index", "Home", new { area = "" });
        }

        [Route("register")]
        public ActionResult Register()
        {
            return View();
        }

        [Route("changepassword")]
        public ActionResult ChangePassword()
        {
            return View();
        }

        [Route("changepasswordsuccess")]
        public ActionResult ChangePasswordSuccess()
        {
            return View();
        }

        [Route("finishregister")]
        public ActionResult FinishRegister()
        {
            return View();
        }

        [Route("verify")]
        public ActionResult Verify()
        {
            return View();
        }

        [Route("finishverification")]
        public ActionResult FinishVerification()
        {
            return View();
        }
    }
}