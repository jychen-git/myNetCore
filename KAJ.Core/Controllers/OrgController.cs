using KAJ.IRepository.Base;
using KAJ.IServices;
using KAJ.Model;
using KAJ.Model.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Threading.Tasks;
using KAJ.Common.Helper;
using System.Linq;

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
            return View();
        }


        public int Fun(int n)
        {
            if (n <= 0)
                return 0;
            else if (n > 0 && n <= 2)
                return 1;
            else return Fun(n - 1) + Fun(n - 2);
        }

        public IActionResult addOrg()
        {
            SQLHelper sQLHelper = SQLHelper.CreateSqlHelper();
            string sql = "SELECT  * FROM A_Org";
            sQLHelper.ExecuteDataTable(sql);
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
            System.Collections.Generic.List<A_Org> a_Org2 = await _orgServices.Query(f => f.ID == "");
            a_Org2.FirstOrDefault();
            return Json("");
        }
    }
}