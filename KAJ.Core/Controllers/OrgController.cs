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
        private readonly IA_OrgServices _orgServices;

        public OrgController(IA_OrgServices orgServices)
        {
            _orgServices = orgServices;
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> InsertOrgAsync()
        {
            A_Org a_Org = new A_Org();
            a_Org.ID = "55e39ebb-6f87-467e-9019-c61fa00a25e7";
            a_Org.Code = "AAA";
            a_Org.Name = "信息部";
            await _orgServices.Add(a_Org);
            return Json("");
        }
    }
}