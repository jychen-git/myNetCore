using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KAJ.CoreAuto.BaseAuto;
using Microsoft.AspNetCore.Mvc;

namespace KAJ.Core.Areas.UI.Controllers
{
    [Area("UI")]
    public class ListController : BaseAutoListController
    {
        public IActionResult Index()
        {
            var ss = Request.Query[""];
            return View();
        }
    }
}