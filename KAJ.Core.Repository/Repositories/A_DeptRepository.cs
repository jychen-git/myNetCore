	//----------A_Dept开始----------
    

using KAJ.Core.Repository.Base;
using KAJ.Core.Model.Models;
using KAJ.Core.IRepository;
using KAJ.Core.IRepository.UnitOfWork;
namespace KAJ.Core.Repository
{	
	/// <summary>
	/// A_DeptRepository
	/// </summary>	
	public class A_DeptRepository : BaseRepository<A_Dept>, IA_DeptRepository
    {
		public A_DeptRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
       
    }
}

	//----------A_Dept结束----------
	