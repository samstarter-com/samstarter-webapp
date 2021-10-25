using Microsoft.AspNetCore.Mvc;

namespace SWI.SoftStock.WebApplications.Main.Areas.Administration.Controllers
{
    [Area("Administration")]
    [Route("administration/structureunits")]
    public class StructureUnitController : Controller 
    {    
        [HttpGet]
        [Route("")]
        public ActionResult Index()
        {
            return View();         
        }
        
        [HttpGet]
        [Route("update")]
        public ActionResult Update()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("details")]
        public ActionResult Details()
        {
            return PartialView();
        }
            
        [HttpGet]
        [Route("delete")]
        public ActionResult Delete()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("add")]
        public ActionResult Add()
        {
            return PartialView();
        }

        [HttpGet]
        [Route("grantuserrole")]
        public ActionResult GrantUserRole()
        {          
            return PartialView();
        }

        [HttpGet]
        [Route("removerole")]
        public ActionResult RemoveRole()
        {
            return PartialView();
        }
    }
}