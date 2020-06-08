
using System;
using System.Threading.Tasks;
using KAJ.Common;
using KAJ.IRepository;
using KAJ.IServices;
using KAJ.Model.Models;
using KAJ.Services.Base;
namespace KAJ.Services
{	
	/// <summary>
	/// S_UI_ListServices
	/// </summary>	
	public class S_UI_ListServices : BaseServices<S_UI_List>, IS_UI_ListServices
    {
	
        IS_UI_ListRepository dal;
        public S_UI_ListServices(IS_UI_ListRepository dal)
        {
            this.dal = dal;
            base.BaseDal = dal;
        }
       
    }
}

	