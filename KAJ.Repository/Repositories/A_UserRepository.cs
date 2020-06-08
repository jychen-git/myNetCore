	//----------A_User开始----------
    

using KAJ.Repository.Base;
using KAJ.Model.Models;
using KAJ.IRepository;
using KAJ.IRepository.Base;
namespace KAJ.Repository
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
	