using KAJ.IRepository.Base;
using KAJ.IServices.Base;
using KAJ.Model;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace KAJ.Services.Base
{
    public class BaseServices<TEntity> : IBaseServices<TEntity> where TEntity : class, new()
    {
        public IBaseRepository<TEntity> BaseDal;//通过在子类的构造函数中注入，这里是基类，不用构造函数

        public async Task<int> Add(TEntity model)
        {
            return await BaseDal.Add(model);
        }

        public async Task<int> Add(List<TEntity> listEntity)
        {
            return await BaseDal.Add(listEntity);
        }

        public async Task<bool> Delete(TEntity model)
        {
            return await BaseDal.Delete(model);
        }

        public async Task<bool> DeleteById(object id)
        {
            return await BaseDal.DeleteById(id);
        }

        public async Task<bool> DeleteByIds(object[] ids)
        {
            return await BaseDal.DeleteByIds(ids);
        }

        virtual public DataTable GetListData()
        {
            return null;
        }

        public IUnitOfWork GetUnitOfWork()
        {
            return BaseDal.GetUnitOfWork();
        }

        public async Task<List<TEntity>> Query()
        {
            return await BaseDal.Query();
        }

        public async Task<List<TEntity>> Query(string strWhere)
        {
            return await BaseDal.Query(strWhere);
        }

        public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression)
        {
            return await BaseDal.Query(whereExpression);
        }

        public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, string strOrderByFileds)
        {
            return await BaseDal.Query(whereExpression, strOrderByFileds);
        }

        public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, Expression<Func<TEntity, object>> orderByExpression, bool isAsc = true)
        {
            return await BaseDal.Query(whereExpression, orderByExpression, isAsc);
        }

        public async Task<List<TEntity>> Query(string strWhere, string strOrderByFileds)
        {
            return await BaseDal.Query(strWhere, strOrderByFileds);
        }

        public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, int intTop, string strOrderByFileds)
        {
            return await BaseDal.Query(whereExpression, intTop, strOrderByFileds);
        }

        public async Task<List<TEntity>> Query(string strWhere, int intTop, string strOrderByFileds)
        {
            return await BaseDal.Query(strWhere, intTop, strOrderByFileds);
        }

        public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, int intPageIndex, int intPageSize, string strOrderByFileds)
        {
            return await BaseDal.Query(whereExpression, intPageIndex, intPageSize, strOrderByFileds);
        }

        public async Task<List<TEntity>> Query(string strWhere, int intPageIndex, int intPageSize, string strOrderByFileds)
        {
            return await BaseDal.Query(strWhere, intPageIndex, intPageSize, strOrderByFileds);
        }

        public async Task<TEntity> QueryById(object objId)
        {
            return await BaseDal.QueryById(objId);
        }

        public async Task<TEntity> QueryById(object objId, bool blnUseCache = false)
        {
            return await BaseDal.QueryById(objId, blnUseCache);
        }

        public async Task<List<TEntity>> QueryByIDs(object[] lstIds)
        {
            return await BaseDal.QueryByIDs(lstIds);
        }

        public async Task<List<TResult>> QueryMuch<T, T2, T3, TResult>(Expression<Func<T, T2, T3, object[]>> joinExpression, Expression<Func<T, T2, T3, TResult>> selectExpression, Expression<Func<T, T2, T3, bool>> whereLambda = null) where T : class, new()
        {
            return await BaseDal.QueryMuch(joinExpression, selectExpression, whereLambda);
        }

        public async Task<PageModel<TEntity>> QueryPage(Expression<Func<TEntity, bool>> whereExpression = null, string strWhere = null, int intPageIndex = 1, int intPageSize = 20, string strOrderByFileds = null)
        {
            return await BaseDal.QueryPage(whereExpression, strWhere, intPageIndex, intPageSize, strOrderByFileds);
        }
        public async Task<PageModel<TEntity>> GetPageData(KAJ.Common.Useful.QueryBuilder qb)
        {
            return await QueryPage(null, qb.GetWhereString(), qb.page, qb.limit);
        }
        public async Task<bool> Update(TEntity model)
        {
            return await BaseDal.Update(model);
        }

        public async Task<bool> Update(TEntity entity, string strWhere)
        {
            return await BaseDal.Update(entity, strWhere);
        }

        public async Task<bool> Update(object operateAnonymousObjects)
        {
            return await BaseDal.Update(operateAnonymousObjects);
        }

        public async Task<bool> Update(TEntity entity, List<string> lstColumns = null, List<string> lstIgnoreColumns = null, string strWhere = "")
        {
            return await BaseDal.Update(entity, lstColumns, lstIgnoreColumns, strWhere);
        }
    }
}
