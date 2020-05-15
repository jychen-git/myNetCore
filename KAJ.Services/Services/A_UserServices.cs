
using System;
using System.Data;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using KAJ.Common;
using KAJ.IRepository;
using KAJ.IServices;
using KAJ.Model.Models;
using KAJ.Services.Base;
namespace KAJ.Services
{
    /// <summary>
    /// A_UserServices
    /// </summary>	
    public class A_UserServices : BaseServices<A_User>, IA_UserServices
    {

        IA_UserRepository dal;
        public A_UserServices(IA_UserRepository dal)
        {
            this.dal = dal;
            base.BaseDal = dal;
        }

        public DataTable setSQL()
        {
            A_User user = new A_User();
            return this.BaseDal.GetUnitOfWork().GetDbClient().Ado.GetDataTable("SELECT * FROM A_User");
        }

    }
}

