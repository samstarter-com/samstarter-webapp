using Microsoft.AspNetCore.Mvc;
using SWI.SoftStock.WebApplications.Main.Helpers;
using SWI.SoftStock.WebApplications.Main.Models;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace SWI.SoftStock.WebApplications.Main.Areas.Management.Controllers
{
    [Area("Management")]
    [Route("management/licenses")]
    public class LicenseController : Controller
    {
        [HttpGet]
        public ViewResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("list")]
        public ActionResult List()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("details")]
        public ActionResult Details()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("add")]
        public ActionResult Add()
        {
            //ViewBag.LicenseTypes = licenseService.GetLicenseTypes();
            return PartialView();
        }

        [HttpGet]
        [Route("update")]

        public ActionResult Update()
        {
            //ViewBag.LicenseTypes = licenseService.GetLicenseTypes();
            return PartialView();
        }

        [HttpGet]
        [Route("delete")]

        public ActionResult Delete()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("usage")]
        public ViewResult Usage()
        {
            return View();
        }


        [HttpGet]
        [Route("usagetable")]
        public PartialViewResult UsageTable()
        {
            return PartialView();
        }


        [HttpGet]
        [Route("usagechart")]
        public PartialViewResult UsageChart()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("usagefilter")]
        public PartialViewResult UsageFilter()
        {
            ViewBag.BarChartRangeTypes = GetBarChartRangeTypes();
            ViewBag.ViewTypes = GetViewTypes();
            return PartialView((UsageFilterModel)null);
        }

        [HttpGet]
        [Route("linktostructureunit")]
        public ActionResult LinkToStructureUnit()
        {
            return PartialView();
        }

        private enum BarChartRangeType
        {
            [Description("Day")] Day = 1,
            [Description("Week")] Week = 2,
            [Description("Month")] Month = 3,
            [Description("Quarter")] Quarter = 4,
            [Description("Year")] Year = 5
        }

        private IEnumerable<DropDownItemModel> GetBarChartRangeTypes()
        {
            var values = EnumHelper.GetValues<BarChartRangeType>().ToArray();
            var result = new DropDownItemModel[values.Count()];
            for (var i = 0; i < values.Count(); i++)
            {
                var des = values[i].GetAttributeOfType<DescriptionAttribute>().Description;
                result[i] = new DropDownItemModel { Id = (int)values[i], Name = des };
            }
            return result;
        }

        private int GetMaxTickl(int maxCount)
        {
            if (maxCount < 10)
            {
                return 10;
            }
            if (maxCount < 100)
            {
                return 100;
            }
            if (maxCount < 1000)
            {
                return 1000;
            }

            return 10000;
        }

        private static IEnumerable<DropDownItemModel> GetViewTypes()
        {
            var values = EnumHelper.GetValues<UsageViewType>().ToArray();
            var result = new DropDownItemModel[values.Count()];
            for (var i = 0; i < values.Count(); i++)
            {
                var des = values[i].GetAttributeOfType<DescriptionAttribute>().Description;
                result[i] = new DropDownItemModel { Id = (int)values[i], Name = des };
            }
            return result;
        }
    }
}