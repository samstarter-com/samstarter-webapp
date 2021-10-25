using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SWI.SoftStock.WebApplications.Main.Helpers;
using System.Threading.Tasks;

namespace SWI.SoftStock.WebApplications.Main.Areas.Administration.Controllers
{
    [Area("Administration")]
    [Route("administration")]
    public class AdministrationController : Controller
    {
        private readonly IAgentLoader agentLoader;
        private readonly ILogger<AdministrationController> log;

        public AdministrationController(ILogger<AdministrationController> log, IAgentLoader agentLoader)
        {
            this.log = log;
            this.agentLoader = agentLoader;
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Route("download")]
        public async Task<ActionResult> Index(string file)
        {
            log.LogInformation($"Trying read file:{file}");
            if (file.ToLower() == "setup.msi")
            {
                var stream = await this.agentLoader.GetStreamAsync(file);
                return File(
                    stream,
                    System.Net.Mime.MediaTypeNames.Application.Octet,
                    file.ToLower());
            }
            return NotFound();
        }
    }
}