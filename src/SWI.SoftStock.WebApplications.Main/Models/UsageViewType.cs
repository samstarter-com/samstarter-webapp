using System.ComponentModel;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    public enum UsageViewType
    {
        [Description("Chart")]
        Chart = 1,
        [Description("Table")]
        Table = 2
    }
}