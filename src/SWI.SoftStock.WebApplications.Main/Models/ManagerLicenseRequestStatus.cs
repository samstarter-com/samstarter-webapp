using System;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    [Flags]
    public enum ManagerLicenseRequestStatus
    {
        None = 0,

        New = 1 << 0,

        AwaitingResponse = 1 << 1,

        SentToManager = 1 << 2,

        ViewedByManager = 1 << 3,

        Closed = 1 << 4,

        Archived = 1 << 5
    }
}