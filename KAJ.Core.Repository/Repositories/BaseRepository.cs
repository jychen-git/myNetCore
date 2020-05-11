    
	//----------开始----------
	
using KAJ.Core.Repository.Base;
using KAJ.Core.Model.Models;
using KAJ.Core.IRepository;
using KAJ.Core.IRepository.UnitOfWork;
namespace KAJ.Core.Repository
{	
	/// <summary>
	/// IBaseRepository
	/// </summary>	
	 public  class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : class, new()
    {

       
    }
}

	//----------结束----------
	