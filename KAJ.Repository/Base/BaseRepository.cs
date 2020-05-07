using KAJ.Common.DB;
using KAJ.Common.Helper;
using KAJ.IRepository.Base;
using KAJ.Model;
using SqlSugar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace KAJ.Repository.Base
{
    public class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : class, new()
    {
        private readonly IUnitOfWork _unitOfWork;
        private SqlSugarClient _dbBase;

        private ISqlSugarClient _dbClient
        {
            get
            {
                /* 如果要开启多库支持，
                 * 1、在appsettings.json 中开启MutiDBEnabled节点为true，必填
                 * 2、设置一个主连接的数据库ID，节点MainDB，对应的连接字符串的Enabled也必须true，必填
                 */
                if (Appsettings.app(new string[] { "MutiDBEnabled" }).ObjToBool())
                {
                    if (typeof(TEntity).GetTypeInfo().GetCustomAttributes(typeof(SugarTable), true).FirstOrDefault((x => x.GetType() == typeof(SugarTable))) is SugarTable sugarTable && !string.IsNullOrEmpty(sugarTable.TableDescription))
                    {
                        _dbBase.ChangeDatabase(sugarTable.TableDescription.ToLower());
                    }
                    else
                    {
                        _dbBase.ChangeDatabase(MainDB.CurrentDbConnId.ToLower());
                    }
                }

                return _dbBase;
            }
        }

        internal ISqlSugarClient Db
        {
            get { return _dbClient; }
        }

        public BaseRepository(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _dbBase = unitOfWork.GetDbClient();
        }


        public async Task<int> Add(TEntity entity)
        {
            var insert = _dbClient.Insertable(entity);
            return await insert.ExecuteReturnIdentityAsync();
        }

        public async Task<int> Add(TEntity entity, Expression<Func<TEntity, object>> insertColumns = null)
        {
            var insert = _dbClient.Insertable(entity);
            if (insertColumns == null)
            {
                return await insert.ExecuteReturnIdentityAsync();
            }
            else
            {
                return await insert.InsertColumns(insertColumns).ExecuteReturnIdentityAsync();
            }
        }

        public async Task<int> Add(List<TEntity> listEntity, Expression<Func<TEntity, object>> insertColumns = null)
        {
            var insert = _dbClient.Insertable(listEntity.ToArray());
            if (insertColumns == null)
            {
                return await insert.ExecuteCommandAsync();
            }
            else
            {
                return await insert.InsertColumns(insertColumns).ExecuteCommandAsync();
            }
        }

        public async Task<int> Add(List<TEntity> listEntity)
        {
            return await _dbClient.Insertable(listEntity.ToArray()).ExecuteCommandAsync();
        }

        public async Task<bool> Delete(TEntity model)
        {
            return await _dbClient.Deleteable(model).ExecuteCommandHasChangeAsync();
        }

        public async Task<bool> DeleteById(object id)
        {
            return await _dbClient.Deleteable<TEntity>(id).ExecuteCommandHasChangeAsync();
        }

        public async Task<bool> DeleteByIds(object[] ids)
        {
            return await _dbClient.Deleteable<TEntity>().In(ids).ExecuteCommandHasChangeAsync();
        }

        public async Task<List<TEntity>> Query()
        {
            return await _dbClient.Queryable<TEntity>().ToListAsync();
        }

        public async Task<List<TEntity>> Query(string strWhere)
        {
            return await _dbClient.Queryable<TEntity>().WhereIF(!string.IsNullOrEmpty(strWhere), strWhere).ToListAsync();
        }

        public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression)
        {
            return await _dbClient.Queryable<TEntity>().WhereIF(whereExpression != null, whereExpression).ToListAsync();
        }

        public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, string strOrderByFileds)
        {
            return await _dbClient.Queryable<TEntity>().WhereIF(whereExpression != null, whereExpression).OrderByIF(strOrderByFileds != null, strOrderByFileds).ToListAsync();
        }

        public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, Expression<Func<TEntity, object>> orderByExpression, bool isAsc = true)
        {
            return await _dbClient.Queryable<TEntity>().OrderByIF(orderByExpression != null, orderByExpression, isAsc ? OrderByType.Asc : OrderByType.Desc).WhereIF(whereExpression != null, whereExpression).ToListAsync();
        }

        public async  Task<List<TEntity>> Query(string strWhere, string strOrderByFileds)
        {
            return await _dbClient.Queryable<TEntity>().OrderByIF(!string.IsNullOrEmpty(strOrderByFileds), strOrderByFileds).WhereIF(!string.IsNullOrEmpty(strWhere), strWhere).ToListAsync();
        }

        public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, int intTop, string strOrderByFileds)
        {
            return await _dbClient.Queryable<TEntity>().OrderByIF(!string.IsNullOrEmpty(strOrderByFileds), strOrderByFileds).WhereIF(whereExpression != null, whereExpression).Take(intTop).ToListAsync();
        }

        public async Task<List<TEntity>> Query(string strWhere, int intTop, string strOrderByFileds)
        {
            return await _dbClient.Queryable<TEntity>().OrderByIF(!string.IsNullOrEmpty(strOrderByFileds), strOrderByFileds).WhereIF(!string.IsNullOrEmpty(strWhere), strWhere).Take(intTop).ToListAsync();
        }

        public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> whereExpression, int intPageIndex, int intPageSize, string strOrderByFileds)
        {
            return await _dbClient.Queryable<TEntity>().OrderByIF(!string.IsNullOrEmpty(strOrderByFileds), strOrderByFileds).WhereIF(whereExpression != null, whereExpression).ToPageListAsync(intPageIndex, intPageSize);
        }

        public async Task<List<TEntity>> Query(string strWhere, int intPageIndex, int intPageSize, string strOrderByFileds)
        {
            return await _dbClient.Queryable<TEntity>().OrderByIF(!string.IsNullOrEmpty(strOrderByFileds), strOrderByFileds).WhereIF(!string.IsNullOrEmpty(strWhere), strWhere).ToPageListAsync(intPageIndex, intPageSize);
        }

        public async Task<TEntity> QueryById(object objId)
        {
            return await _dbClient.Queryable<TEntity>().In(objId).SingleAsync();
        }

        public async Task<TEntity> QueryById(object objId, bool blnUseCache = false)
        {
            return await _dbClient.Queryable<TEntity>().WithCacheIF(blnUseCache).In(objId).SingleAsync();

        }

        public async Task<List<TEntity>> QueryByIDs(object[] lstIds)
        {
            return await _dbClient.Queryable<TEntity>().In(lstIds).ToListAsync();
        }

        public async Task<List<TResult>> QueryMuch<T, T2, T3, TResult>(Expression<Func<T, T2, T3, object[]>> joinExpression, Expression<Func<T, T2, T3, TResult>> selectExpression, Expression<Func<T, T2, T3, bool>> whereLambda = null) where T : class, new()
        {
            if (whereLambda == null)
            {
                return await _dbClient.Queryable(joinExpression).Select(selectExpression).ToListAsync();
            }
            return await _dbClient.Queryable(joinExpression).Where(whereLambda).Select(selectExpression).ToListAsync();
        }

        public async Task<PageModel<TEntity>> QueryPage(Expression<Func<TEntity, bool>> whereExpression, int intPageIndex = 1, int intPageSize = 20, string strOrderByFileds = null)
        {
            RefAsync<int> totalCount = 0;
            var list = await _dbClient.Queryable<TEntity>()
             .OrderByIF(!string.IsNullOrEmpty(strOrderByFileds), strOrderByFileds)
             .WhereIF(whereExpression != null, whereExpression)
             .ToPageListAsync(intPageIndex, intPageSize, totalCount);

            int pageCount = (Math.Ceiling(totalCount.ObjToDecimal(0) / intPageSize.ObjToDecimal(0))).ObjToInt();
            return new PageModel<TEntity>() { dataCount = totalCount, pageCount = pageCount, page = intPageIndex, PageSize = intPageSize, data = list };
        }

        public async Task<bool> Update(TEntity model)
        {
            return await _dbClient.Updateable(model).ExecuteCommandHasChangeAsync();

        }

        public async Task<bool> Update(TEntity entity, string strWhere)
        {
            return await _dbClient.Updateable(entity).Where(strWhere).ExecuteCommandHasChangeAsync();

        }
        public async Task<bool> Update(string strSql, SugarParameter[] parameters = null)
        {
            return await _dbClient.Ado.ExecuteCommandAsync(strSql, parameters) > 0;
        }
        public async Task<bool> Update(object operateAnonymousObjects)
        {
            return await _dbClient.Updateable<TEntity>(operateAnonymousObjects).ExecuteCommandAsync() > 0;
        }

        public async Task<bool> Update(TEntity entity, List<string> lstColumns = null, List<string> lstIgnoreColumns = null, string strWhere = "")
        {
            IUpdateable<TEntity> up = _dbClient.Updateable(entity);
            if (lstIgnoreColumns != null && lstIgnoreColumns.Count > 0)
            {
                up = up.IgnoreColumns(lstIgnoreColumns.ToArray());
            }
            if (lstColumns != null && lstColumns.Count > 0)
            {
                up = up.UpdateColumns(lstColumns.ToArray());
            }
            if (!string.IsNullOrEmpty(strWhere))
            {
                up = up.Where(strWhere);
            }
            return await up.ExecuteCommandHasChangeAsync();
        }

    }
}
