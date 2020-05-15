using KAJ.IRepository.Base;
using KAJ.IServices;
using KAJ.Model;
using KAJ.Model.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Threading.Tasks;

namespace KAJ.Core.Controllers
{
    public class OrgController : Controller
    {
        private readonly IA_OrgServices _orgServices;

        /// <summary>
        /// 构造函数注入
        /// </summary>
        /// <param name="orgServices"></param>
        public OrgController(IA_OrgServices orgServices)
        {
            _orgServices = orgServices;
        }

        public IActionResult Index()
        {
            DataTable data = _orgServices.GetListData();
            return View();
        }

        public IActionResult addOrg()
        {
            return View();
        }

        //public async Task<JsonResult> InsertOrgAsync()
        //{
        //    A_Org a_Org = new A_Org();
        //    a_Org.ID = Guid.NewGuid().ToString();
        //    a_Org.Code = "AAA";
        //    a_Org.Name = "信息部";
        //    await _orgServices.Add(a_Org);
        //    return Json("");
        //}
        [HttpPost]
        public async Task<JsonResult> InsertOrgAsync()
        {
            var data = new MessageModel<string>();

            A_Org a_Org = new A_Org();
            a_Org.ID = Guid.NewGuid().ToString();
            a_Org.Code = "AAA";
            a_Org.Name = "信息部";
            await _orgServices.Add(a_Org);

            return Json("");
        }
    }
}