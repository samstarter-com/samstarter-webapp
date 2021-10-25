using System;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    [Flags]
    public enum LicensedMachineFilterType
    {
        None = 1 << 0,

        PartialLicensed = 1 << 1,

        Licensed = 1 << 2,

		All = None | PartialLicensed | Licensed
    }
}