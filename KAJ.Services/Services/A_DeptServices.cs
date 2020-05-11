
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
	/// A_DeptServices
	/// </summary>	
	public class A_DeptServices : BaseServices<A_Dept>, IA_DeptServices
    {
	
        IA_DeptRepository dal;
        public A_DeptServices(IA_DeptRepository dal)
        {
            this.dal = dal;
            base.BaseDal = dal;
        }
       
    }
}

	