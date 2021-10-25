using System;

namespace SWI.SoftStock.WebApplications.Main.Models
{
    public class DocumentModelEx
    {
        public string Name { get; set; }
        public string HcLocation { get; set; }
        public byte[] Content { get; set; }
        public Guid Id { get; set; }
    }
}