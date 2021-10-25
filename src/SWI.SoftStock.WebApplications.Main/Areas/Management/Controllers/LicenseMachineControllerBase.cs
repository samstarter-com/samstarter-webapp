using Microsoft.AspNetCore.Mvc;
using SWI.SoftStock.WebApplications.Main.Models;
using System;
using System.Collections.Generic;

namespace SWI.SoftStock.WebApplications.Main.Areas.Management.Controllers
{
    public abstract class LicenseMachineControllerBase : Controller
    {
        protected static Dictionary<LicensedMachineFilterType, string> LicensedMachineFilterTypes()
        {
            var dict = new Dictionary<LicensedMachineFilterType, string>();
            dict.Add(LicensedMachineFilterType.None, GetLicensedMachineFilterTypeEn(LicensedMachineFilterType.None));
            dict.Add(LicensedMachineFilterType.PartialLicensed,
                GetLicensedMachineFilterTypeEn(LicensedMachineFilterType.PartialLicensed));
            dict.Add(LicensedMachineFilterType.Licensed,
                GetLicensedMachineFilterTypeEn(LicensedMachineFilterType.Licensed));
            return dict;
        }

        protected static string GetLicensedMachineFilterTypeEn(LicensedMachineFilterType currentStatus)
        {
            switch (currentStatus)
            {
                case LicensedMachineFilterType.None:
                    return "Non licensed";
                case LicensedMachineFilterType.PartialLicensed:
                    return "Partial licensed";
                case LicensedMachineFilterType.Licensed:
                    return "Licensed";
                default:
                    throw new NotImplementedException();
            }
        }
    }
}