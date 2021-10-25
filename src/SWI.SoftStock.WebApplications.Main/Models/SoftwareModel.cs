using System;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    using System.Collections.Generic;
  
	public class SoftwareModel 
    {
        public Guid SoftwareId { get; set; }

      
        public string Name { get; set; }

        
        public string PublisherName { get; set; }

       
        public string Version { get; set; }

       
        public string SystemComponent { get; set; }

      
        public string WindowsInstaller { get; set; }

       
        public string ReleaseType { get; set; }

        
        public int TotalInstallationCount { get; set; }

        
        public int LicensedInstallationCount { get; set; }

      
        public int UnLicensedInstallationCount { get; set; }

        public IEnumerable<ObservableModel> ObservableProcesses { get; set; }
    }
}