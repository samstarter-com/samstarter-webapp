using System;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    public class UserModel
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string StructureUnitName { get; set; }
    }
}