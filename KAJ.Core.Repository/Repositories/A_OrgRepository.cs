	//----------A_Org开始----------
    

using KAJ.Core.Repository.Base;
using KAJ.Core.Model.Models;
using KAJ.Core.IRepository;
using KAJ.Core.IRepository.UnitOfWork;
namespace KAJ.Core.Repository
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
	