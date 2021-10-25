namespace SWI.SoftStock.WebApplications.Main.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class StructureUnitModel
    {
        public Guid UniqueId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [Display(Name = "Name")]
        [MaxLength(40, ErrorMessage = "Name cannot be longer than 40 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Short name is required")]
        [Display(Name = "Short name")]
        [MaxLength(20, ErrorMessage = "Short name cannot be longer than 20 characters")]
        public string ShortName { get; set; }

        public Guid? ParentUniqueId { get; set; }

        public bool IsRootUnit { get; set; }

        public override string ToString()
        {
            return $"UniqueId: {UniqueId} Name:{Name} ShortName:{ShortName}";
        }
    }
}