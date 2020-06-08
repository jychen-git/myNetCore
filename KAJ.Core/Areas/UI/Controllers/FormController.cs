using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace KAJ.Core.Areas.UI.Controllers
{
    [Area("UI")]
    public class FormController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CoreView()
        {
            return View();
        }
    }
}