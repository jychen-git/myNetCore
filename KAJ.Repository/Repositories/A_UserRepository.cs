//----------A_User开始----------


using KAJ.Repository.Base;
using KAJ.Model.Models;
using KAJ.IRepository;
using KAJ.IRepository.Base;
using System.Runtime.CompilerServices;

namespace KAJ.Repository
{
    /// <summary>
    /// A_UserRepository
    /// </summary>	
    public class A_UserRepository : BaseRepository<A_User>, IA_UserRepository
    {
        public A_UserRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
            unitOfWork.GetDbClient().Ado.GetDataTable("", "");
        }
        public void setSQL()
        {
            this.UnitOfWork.CommitTran();
            this.Db.Ado.GetDataTable("");
            this.Db.Ado.BeginTran();
            this.Db.Ado.CommitTran();
            this.Db.Ado.RollbackTran();
        }

    }
}

//----------A_User结束----------
