using System;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    public class AlertModelEx
    {
        public DateTime AlertDateTime => AlertDate.AddTicks(AlertTime.Ticks);

        public DateTime AlertDate { get; set; }
        public TimeSpan AlertTime { get; set; }

        public Guid[] AlertUsersId { get; set; }
        public UserModel[] AlertUsers { get; set; }
        public string AlertText { get; set; }

        public Guid Id { get; set; }
    }
}