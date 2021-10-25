using System.ComponentModel.DataAnnotations;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    public class FeedbackModel
    {
        [MaxLength(200)]
        [Display(Name = "Title")]
        public string Title { get; set; }

        [MaxLength(255)]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Display(Name = "Comment")]
        public string Comment { get; set; }
    }
}