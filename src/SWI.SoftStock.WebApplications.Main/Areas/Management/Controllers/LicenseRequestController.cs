using Microsoft.AspNetCore.Mvc;
using SWI.SoftStock.WebApplications.Main.Models;
using System;
using System.Collections.Generic;

namespace SWI.SoftStock.WebApplications.Main.Areas.Management.Controllers
{
    [Area("Management")]
    [Route("management/licenserequests")]
    public class LicenseRequestController : Controller
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
            var statuses = ManagerLicenseRequestStatuses();
            ViewBag.Statuses = statuses;
            return PartialView();
        }

        [HttpGet]
        [Route("archive")]
        public ActionResult Archive()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("savelicenserequest")]
        public ActionResult SaveLicenseRequest()
        {
            ViewBag.ViewType = LicenseRequestViewType.New;
            return PartialView();
        }

        [HttpGet]
        [Route("update")]
        public ActionResult Update()
        {
            ViewBag.ViewType = LicenseRequestViewType.Update;
            return PartialView("SaveLicenseRequest");
        }

        [HttpGet]
        [Route("send")]
        public ActionResult Send()
        {
            return PartialView();
        }


        [HttpGet]
        [Route("CreateLicense")]
        public ActionResult CreateLicense()
        {
            return PartialView();
        }

        private static Dictionary<ManagerLicenseRequestStatus, string> ManagerLicenseRequestStatuses()
        {
            var dict = new Dictionary<ManagerLicenseRequestStatus, string>();
            foreach (var status in LicenseRequestStatusesViewedByManager())
            {
                var s = GetManagerLicenseRequestStatus(status);
                if (!dict.ContainsKey(s))
                {
                    dict.Add(s, GetLicenseRequestManagerStatusEn(s));
                }
            }

            return dict;
        }

        private static ManagerLicenseRequestStatus GetManagerLicenseRequestStatus(LicenseRequestStatus currentStatus)
        {
            switch (currentStatus)
            {
                case LicenseRequestStatus.New:
                    return ManagerLicenseRequestStatus.New;
                case LicenseRequestStatus.SentToUser:
                    return ManagerLicenseRequestStatus.AwaitingResponse;
                case LicenseRequestStatus.ViewedByUser:
                    return ManagerLicenseRequestStatus.AwaitingResponse;
                case LicenseRequestStatus.SentToManager:
                    return ManagerLicenseRequestStatus.SentToManager;
                case LicenseRequestStatus.ViewedByManager:
                    return ManagerLicenseRequestStatus.ViewedByManager;
                case LicenseRequestStatus.Closed:
                    return ManagerLicenseRequestStatus.Closed;
                case LicenseRequestStatus.Archived:
                    return ManagerLicenseRequestStatus.Archived;
                default:
                    throw new NotImplementedException();
            }
        }

        private static LicenseRequestStatus[] LicenseRequestStatusesViewedByManager()
        {
            return new[]
            {
                LicenseRequestStatus.New,
                LicenseRequestStatus.SentToUser,
                LicenseRequestStatus.ViewedByUser,
                LicenseRequestStatus.SentToManager,
                LicenseRequestStatus.ViewedByManager,
                LicenseRequestStatus.Closed
            };
        }

        private static string GetLicenseRequestManagerStatusEn(ManagerLicenseRequestStatus currentStatus)
        {
            switch (currentStatus)
            {
                case ManagerLicenseRequestStatus.New:
                    return "Draft";
                case ManagerLicenseRequestStatus.AwaitingResponse:
                    return "Awaiting response";
                case ManagerLicenseRequestStatus.SentToManager:
                    return "New received";
                case ManagerLicenseRequestStatus.ViewedByManager:
                    return "Received";
                case ManagerLicenseRequestStatus.Closed:
                    return "Closed";
                case ManagerLicenseRequestStatus.Archived:
                    return "Archived";
                default:
                    throw new NotImplementedException();
            }
        }
    }
}