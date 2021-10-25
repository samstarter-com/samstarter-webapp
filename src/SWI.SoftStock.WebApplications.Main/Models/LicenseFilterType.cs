using System;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    [Flags]
    public enum LicenseFilterType
    {
        None = 0, // 0

        Licensed = 1 << 0, //1

        Unlicensed = 1 << 1, //2

        ExpiredLicensed = 1 << 2 //4
    }
}