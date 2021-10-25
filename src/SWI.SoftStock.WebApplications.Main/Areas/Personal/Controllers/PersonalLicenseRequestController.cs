using Microsoft.AspNetCore.Mvc;
using SWI.SoftStock.WebApplications.Main.Models;
using System;
using System.Collections.Generic;

namespace SWI.SoftStock.WebApplications.Main.Areas.Personal.Controllers
{
    [Area("Personal")]
    [Route("personal/licenserequests")]
    public class PersonalLicenseRequestController : Controller
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
            var statuses = PersonalLicenseRequestStatuses();
            ViewBag.Statuses = statuses;
            return PartialView();
        }

        [HttpGet]
        [Route("details")]
        public PartialViewResult Details()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("answer")]
        public ActionResult Answer()
        {
            return PartialView();
        }

        private static Dictionary<PersonalLicenseRequestStatus, string> PersonalLicenseRequestStatuses()
        {

            var dict = new Dictionary<PersonalLicenseRequestStatus, string>();
            foreach (var status in LicenseRequestStatusesViewedByPerson())
            {
                var s = GetPersonalLicenseRequestStatus(status);
                if (!dict.ContainsKey(s))
                {
                    dict.Add(s, GetLicenseRequestUserStatusEn(s));
                }
            }

            return dict;
        }

        private static IEnumerable<LicenseRequestStatus> LicenseRequestStatusesViewedByPerson()
        {
            return new[]
            {
                LicenseRequestStatus.SentToUser,
                LicenseRequestStatus.ViewedByUser,
                LicenseRequestStatus.SentToManager,
                LicenseRequestStatus.ViewedByManager,
                LicenseRequestStatus.Closed
            };
        }

        private static PersonalLicenseRequestStatus GetPersonalLicenseRequestStatus(LicenseRequestStatus currentStatus)
        {
            switch (currentStatus)
            {
                case LicenseRequestStatus.SentToUser:
                    return PersonalLicenseRequestStatus.New;
                case LicenseRequestStatus.ViewedByUser:
                    return PersonalLicenseRequestStatus.ViewedByUser;
                case LicenseRequestStatus.SentToManager:
                    return PersonalLicenseRequestStatus.Answered;
                case LicenseRequestStatus.ViewedByManager:
                    return PersonalLicenseRequestStatus.Answered;
                case LicenseRequestStatus.Closed:
                    return PersonalLicenseRequestStatus.Answered;
                default:
                    throw new NotImplementedException();
            }
        }

        private static string GetLicenseRequestUserStatusEn(PersonalLicenseRequestStatus currentStatus)
        {
            switch (currentStatus)
            {
                case PersonalLicenseRequestStatus.New:
                    return "New received";
                case PersonalLicenseRequestStatus.ViewedByUser:
                    return "Received";
                case PersonalLicenseRequestStatus.Answered:
                    return "Answered";
                default:
                    throw new NotImplementedException();
            }
        }
    }
}