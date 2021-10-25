namespace SWI.SoftStock.WebApplications.Main.Models
{
    using System;

    public class ObservableModel
    {
        public Guid ObservableId { get; set; }

        public string ProcessName { get; set; }
      
        public Guid? SoftwareId { get; set; }

        public string SoftwareName { get; set; }
    }
}