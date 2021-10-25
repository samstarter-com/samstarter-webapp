using System;
using System.ComponentModel.DataAnnotations;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    public class LicenseModelEx
    {
        public Guid? LicenseId { get; set; }

        public Guid StructureUnitId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [Display(Name = "Name")]
        [MaxLength(255, ErrorMessage = "Name cannot be longer than 255 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "License type is required")]
        [Display(Name = "License type")]
        public int? LicenseTypeId { get; set; }

        [Display(Name = "License count")]
        [Range(0, int.MaxValue, ErrorMessage = "The number of licenses must be greater then 0")]
        [RegularExpression(@"\d*", ErrorMessage = "Invalid number")]
        public int Count { get; set; }

        [Required(ErrorMessage = "Start date is required")]
        [Display(Name = "Start date")]
        [DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:dd.MM.yy}", ApplyFormatInEditMode = true)]
        public DateTime BeginDate { get; set; }

        [Required(ErrorMessage = "Expiration date is required")]
        [Display(Name = "Expiration date")]
        [DataType(DataType.Date), DisplayFormat(DataFormatString = "{0:dd.MM.yy}", ApplyFormatInEditMode = true)]
        public DateTime ExpirationDate { get; set; }

        [DataType(DataType.MultilineText)]
        [Display(Name = "Comments")]
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        [MaxLength(1000, ErrorMessage = "Comments cannot be longer than 1000 characters")]
        public string Comments { get; set; }

        [Display(Name = "Licensed software")]
        [Required(ErrorMessage = @"License must be linked to a software")]
        public bool? HasLinkedSoftware { get; set; }

        public SoftwareModel[] LinkedSoftwares { get; set; }

        public DocumentModelEx[] Documents { get; set; }

        public AlertModelEx[] Alerts { get; set; }       
    }
}