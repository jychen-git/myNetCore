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
using System.Collections.Generic;
using KAJ.Common.Useful;

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
            _orgServices.GetListData();
            return View();
        }


        public IActionResult addOrg()
        {
            return View();
        }
        public IActionResult List()
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



        [HttpPost]
        public async Task<JsonResult> InsertOrgAsync()
        {
            var response = new Model.ResponseModel<A_Org>();

            var data = Request.Form.Keys.FirstOrDefault();
            A_Org a_Org = new A_Org();
            a_Org = JsonHelper.ToObject<A_Org>(data);
            a_Org.ID = GuidHelper.CreateGuid();
            int i = await _orgServices.Add(a_Org);
            response.success = true;
            response.msg = "保存成功!";
            response.data = a_Org;
            return Json(response);
        }

        public async Task<JsonResult> GetListAsync(QueryBuilder qb)
        {
            var data = await _orgServices.GetPageData(qb);
            return Json(data);
        }
    }
}