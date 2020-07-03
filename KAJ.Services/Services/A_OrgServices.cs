
using System;
using System.Data;
using System.Threading.Tasks;
using KAJ.Common;
using KAJ.Common.Useful;
using KAJ.IRepository;
using KAJ.IServices;
using KAJ.Model.Models;
using KAJ.Services.Base;
namespace KAJ.Services
{	
	/// <summary>
	/// A_OrgServices
	/// </summary>	
	public class A_OrgServices : BaseServices<A_Org>, IA_OrgServices
    {
	
        IA_OrgRepository dal;
        public A_OrgServices(IA_OrgRepository dal)
        {
            this.dal = dal;
            base.BaseDal = dal;
        }

    }
}

	