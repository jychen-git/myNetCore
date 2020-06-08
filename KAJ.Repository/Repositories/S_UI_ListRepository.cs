	//----------S_UI_List开始----------
    

using KAJ.Repository.Base;
using KAJ.Model.Models;
using KAJ.IRepository;
using KAJ.IRepository.Base;
namespace KAJ.Repository
{	
	/// <summary>
	/// S_UI_ListRepository
	/// </summary>	
	public class S_UI_ListRepository : BaseRepository<S_UI_List>, IS_UI_ListRepository
    {
		public S_UI_ListRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
       
    }
}

	//----------S_UI_List结束----------
	