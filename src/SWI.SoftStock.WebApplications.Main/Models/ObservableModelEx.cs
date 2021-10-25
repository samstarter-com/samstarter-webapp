using System;
using System.ComponentModel.DataAnnotations;

namespace SWI.SoftStock.WebApplications.Main.Models
{
	
	public class ObservableModelEx
	{
		public Guid ObservableId { get; set; }

		[Display(Name = "Process name")]
		[Required(ErrorMessage = @"Process name is required")]		
		public string ProcessName { get; set; }

		[Display(Name = "Software")]
		[Required(ErrorMessage = @"Observable process must be linked to a software")]
		public Guid? SoftwareId { get; set; }
		
		public string SoftwareName { get; set; }
		
		public string PublisherName { get; set; }
		
		public string CreatedBy { get; set; }
		
		public int AppendedMachines { get; set; }
	}
}