	//----------A_User开始----------
    

using KAJ.Core.Repository.Base;
using KAJ.Core.Model.Models;
using KAJ.Core.IRepository;
using KAJ.Core.IRepository.UnitOfWork;
namespace KAJ.Core.Repository
{	
	/// <summary>
	/// A_UserRepository
	/// </summary>	
	public class A_UserRepository : BaseRepository<A_User>, IA_UserRepository
    {
		public A_UserRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
       
    }
}

	//----------A_User结束----------
	