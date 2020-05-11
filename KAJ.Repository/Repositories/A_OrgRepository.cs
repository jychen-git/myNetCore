	//----------A_Org开始----------
    

using KAJ.Repository.Base;
using KAJ.Model.Models;
using KAJ.IRepository;
using KAJ.IRepository.Base;
namespace KAJ.Repository
{	
	/// <summary>
	/// A_OrgRepository
	/// </summary>	
	public class A_OrgRepository : BaseRepository<A_Org>, IA_OrgRepository
    {
		public A_OrgRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
       
    }
}

	//----------A_Org结束----------
	