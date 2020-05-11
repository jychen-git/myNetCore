	//----------A_Dept开始----------
    

using KAJ.Repository.Base;
using KAJ.Model.Models;
using KAJ.IRepository;
using KAJ.IRepository.Base;
namespace KAJ.Repository
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
	