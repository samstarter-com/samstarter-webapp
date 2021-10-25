using log4net;

namespace SWI.SoftStock.WebApplications.Main.Controllers
{
    public interface ILogged
    {
        ILog Log { get; }
    }
}