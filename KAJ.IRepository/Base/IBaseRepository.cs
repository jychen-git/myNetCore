using KAJ.Model;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace KAJ.IRepository.Base
{
    public interface IBaseRepository<TEntity> where TEntity : class
    {
        /// <summary>
        /// 返回工作单元，手动创建事物或者自定义SQL
        /// </summary>
        /// <returns></returns>
        IUnitOfWork GetUnitOfWork();

        /// <summary>
        /// 返回任意SQL的数据
        /// </summary>
        /// <returns></returns>
        DataTable GetListData();

        /// <summary>
        /// 根据主键查找实体
        /// </summary>
        /// <param name="objId">实体主键</param>
        /// <returns>目标实体</returns>
        Task<TEntity> QueryById(object objId);

        /// <summary>
        /// 根据主键查找实体
        /// </summary>
        /// <param name="objId">实体主键</param>
        /// <param name="blnUseCache">使用缓存</param>
        /// <returns>目标实体</returns>
        Task<TEntity> QueryById(object objId, bool blnUseCache = false);

        /// <summary>
        /// 根据主键数组查找实体集合
        /// </summary>
        /// <param name="lstIds">实体主键数组</param>
        /// <returns>数据实体列表</returns>
        Task<List<TEntity>> QueryByIDs(object[] lstIds);

        /// <summary>
        /// 插入实体
        /// </summary>
        /// <param name="entity">实体</param>
        /// <returns>返回受影响行数</returns>
        Task<int> Add(TEntity entity);
        /// <summary>
        /// 插入实体
        /// </summary>
        /// <param name="entity">实体</param>
        /// <param name="insertColumns">指定只插入列</param>
        /// <returns>返回受影响行数</returns>
        Task<int> Add(TEntity entity, Expression<Func<TEntity, object>> insertColumns = null);
        /// <summary>
        /// 批量插入实体
        /// </summary>
        /// <param name="listEntity">实体数组</param>
        /// <returns>受影响行数</returns>
        Task<int> Add(List<TEntity> listEntity);

        /// <summary>
        /// 批量插入实体
        /// </summary>
        /// <param name="listEntity">实体数组</param>
        /// <param name="insertColumns">指定只插入列</param>
        /// <returns>受影响行数</returns>
        Task<int> Add(List<TEntity> listEntity, Expression<Func<TEntity, object>> insertColumns = null);
        /// <summary>
        /// 删除指定ID的数据
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<bool> DeleteById(object id);
        /// <summary>
        /// 根据实体删除一条数据
        /// </summary>
        /// <param name="model">实体数据</param>
        /// <returns></returns>
        Task<bool> Delete(TEntity model);
        /// <summary>
        /// 删除指定数组IDs的数据
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        Task<bool> DeleteByIds(object[] ids);

        Task<bool> Update(TEntity model);
        Task<bool> Update(TEntity entity, string strWhere);
        Task<bool> Update(object operateAnonymousObjects);

        Task<bool> Update(TEntity entity, List<string> lstColumns = null, List<string> lstIgnoreColumns = null, string strWhere = "");
        /// <summary>
        /// 查询所有数据
        /// </summary>
        /// <returns>数据列表</returns>
        Task<List<TEntity>> Query();
        /// <summary>
        /// 根据条件查询数据
        /// </summary>
        /// <param name="strWhere">条件</param>
        /// <returns>数据列表</returns>
        Task<List<TEntity>> Query(string strWhere);
        /// <summary>
        /// 根据表达式查询数据
        /// </summary>
        /// <param name="whereExpression">表达式</param>
        /// <returns>数据列表</returns>
        Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression);
        Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, string strOrderByFileds);
        Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, Expression<Func<TEntity, object>> orderByExpression, bool isAsc = true);
        Task<List<TEntity>> Query(string strWhere, string strOrderByFileds);

        Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, int intTop, string strOrderByFileds);
        Task<List<TEntity>> Query(string strWhere, int intTop, string strOrderByFileds);

        Task<List<TEntity>> Query(
            Expression<Func<TEntity, bool>> whereExpression, int intPageIndex, int intPageSize, string strOrderByFileds);
        Task<List<TEntity>> Query(string strWhere, int intPageIndex, int intPageSize, string strOrderByFileds);


        Task<PageModel<TEntity>> QueryPage(Expression<Func<TEntity, bool>> whereExpression, int intPageIndex = 1, int intPageSize = 20, string strOrderByFileds = null);

        Task<List<TResult>> QueryMuch<T, T2, T3, TResult>(
            Expression<Func<T, T2, T3, object[]>> joinExpression,
            Expression<Func<T, T2, T3, TResult>> selectExpression,
            Expression<Func<T, T2, T3, bool>> whereLambda = null) where T : class, new();
    }
}
