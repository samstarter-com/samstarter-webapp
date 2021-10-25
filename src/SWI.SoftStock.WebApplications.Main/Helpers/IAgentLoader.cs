using System.IO;
using System.Threading.Tasks;

namespace SWI.SoftStock.WebApplications.Main.Helpers
{
    public interface IAgentLoader
    {
        Task<Stream> GetStreamAsync(string file);
    }
}