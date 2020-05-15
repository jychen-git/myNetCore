
using System;
using System.Data;
using System.Threading.Tasks;
using KAJ.Common;
using KAJ.IRepository;
using KAJ.IServices;
using KAJ.Model.Models;
using KAJ.Services.Base;
using SqlSugar;

namespace KAJ.Services
{
    /// <summary>
    /// A_OrgServices
    /// </summary>	
    public class A_OrgServices : BaseServices<A_Org>, IA_OrgServices
    {

        IA_OrgRepository dal;
        readonly SqlSugarClient sqlSugarClient;
        public A_OrgServices(IA_OrgRepository dal)
        {
            this.dal = dal;
            base.BaseDal = dal;
            this.sqlSugarClient = dal.GetUnitOfWork().GetDbClient();
        }

        public override DataTable GetListData()
        {
            return sqlSugarClient.Ado.GetDataTable("SELECT * FROM A_Org");
        }

    }
}

