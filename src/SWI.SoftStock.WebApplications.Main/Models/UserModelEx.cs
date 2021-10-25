using System;
using System.ComponentModel.DataAnnotations;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    public class UserModelEx
	{
		public Guid UserId { get; set; }

		[Required(ErrorMessage = "User name is required")]
		[Display(Name = "User name")]
		[MaxLength(255, ErrorMessage = "User name cannot be longer than 255 characters")]		
		public string UserName { get; set; }

		[Required(ErrorMessage = "First name is required")]
		[Display(Name = "First name")]
		[MaxLength(255, ErrorMessage = "First name cannot be longer than 255 characters")]		
		public string FirstName { get; set; }

		[Required(ErrorMessage = "Last name is required")]
		[Display(Name = "Last name")]
		[MaxLength(255, ErrorMessage = "Last name cannot be longer than 255 characters")]	
		public string LastName { get; set; }

		[Required(ErrorMessage = "Email is required")]
		[Display(Name = "Email")]
		[EmailAddress(ErrorMessage = "Not a valid e-mail!")]
		[MaxLength(255, ErrorMessage = "Email cannot be longer than 255 characters")]	
		public string Email { get; set; }

		[Required]
		[StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
		[DataType(DataType.Password)]
		[Display(Name = "Password")]
		public string Password { get; set; }

		[DataType(DataType.Password)]
		[Display(Name = "Confirm password")]
		[Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
		public string ConfirmPassword { get; set; }
        		
		public bool IsApproved { get; set; }
		
		public bool IsLocked { get; set; }

		public DateTime? CreateDate { get; set; }

		public DateTime? LastActivityDate { get; set; }

		public Guid StructureUnitId { get; set; }
	
		public string StructureUnitName { get; set; }

        public string BaseAddress { get; set; }        
	}
}