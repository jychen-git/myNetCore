using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KAJ.IServices;
using KAJ.Model.Models;
using Microsoft.AspNetCore.Mvc;

namespace KAJ.Core.Controllers
{
    public class OrgController : Controller
    {
        readonly IA_OrgServices _orgServices;
        public IActionResult Index()
        {
            return View();
        }

        public JsonResult InsertOrg()
        {
            A_Org a_Org = new A_Org();
            a_Org.ID = "asdfsg";
            a_Org.Code = "AAA";
            a_Org.Name = "信息部";
            _orgServices.Add(a_Org);
            return Json("");
        }
    }
}