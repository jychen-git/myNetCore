using KAJ.Common.Useful;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace KAJ.Common.Helper
{
    /// <summary>
    /// SQLHelper支持QueryBuilder
    /// </summary>
    public static class SQLHelperExtend
    {

        /// <summary>
        /// 新的重载方法，处理orderby
        /// </summary>
        /// <param name="sqlHelper"></param>
        /// <param name="sql"></param>
        /// <param name="qb"></param>
        /// <param name="orderby"></param>
        /// <returns></returns>
        public static MiniData ExecuteMiniData(this SQLHelper sqlHelper, string sql, QueryBuilder qb, string orderby = "ID")
        #region 
        {
            DataTable dt = sqlHelper.ExecuteDataTable_Mini(sql, qb, orderby);
            MiniData gridData = new MiniData(dt, qb.TotolCount);
            return gridData;
        }
        #endregion

        public static DataTable ExecuteDataTable_Mini(this SQLHelper sqlHelper, string sql, QueryBuilder qb, string orderby)
        #region 
        {
            try
            {
                //TODO 重量级，权限自动过滤
                // SearchCondition authCnd = FormulaHelper.CreateAuthDataFilter();
                // SearchCondition corpCnd = CreateCorpAuth(sqlHelper, sql);
                // sql = string.Format("select * from ({0}) sourceTable1 where 1=1 {1} {2}", sql, authCnd.GetWhereString(false), corpCnd.GetWhereString(false));

                sql = string.Format("select {2} from ({0}) sourceTable {1}", sql, qb.GetWhereString(), qb.Fields);

                string[] qbSortFields = string.IsNullOrEmpty(qb.SortField) ? "ID".Split(',') : qb.SortField.Split(',');
                string[] qbSortOrders = string.IsNullOrEmpty(qb.SortOrder) ? "DESC".Split(',') : qb.SortOrder.Split(',');
                for (int i = 0; i < qbSortFields.Length; i++)
                {
                    qbSortFields[i] += " " + qbSortOrders[i];
                }
                string qbOrderBy = string.Join(",", qbSortFields);

                if (string.IsNullOrEmpty(orderby))
                {
                    orderby = "order by " + qbOrderBy;
                }
                else if (qb.DefaultSort == false)
                {
                    orderby = "order by " + qbOrderBy;
                }

                if (qb.PageSize <= 0)
                {
                    DataTable dt = sqlHelper.ExecuteDataTable(sql + " " + orderby);
                    qb.TotolCount = dt.Rows.Count;
                    return dt;
                }
                else
                {
                    object totalCount = sqlHelper.ExecuteScalar(string.Format("select count(1) from ({0}) tableCount", sql));
                    qb.TotolCount = Convert.ToInt32(totalCount);


                    int start = qb.PageIndex * qb.PageSize + 1;
                    int end = start + qb.PageSize - 1;

                    if (start > qb.TotolCount)
                    {
                        start = 0;
                        end = qb.PageSize - 1;
                        qb.PageIndex = 0;
                    }

                    sql = string.Format(@"select * from (select tempTable1.*, Row_number() over({1}) as RowNumber from ({0}) tempTable1) tmpTable2 where RowNumber between {2} and {3}", sql, orderby, start, end);

                    return sqlHelper.ExecuteDataTable(sql);
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion

        /// <summary>
        /// 返回分页数据
        /// </summary>
        /// <param name="sqlHelper"></param>
        /// <param name="sql"></param>
        /// <param name="qb"></param>
        /// <returns></returns>
        public static LayData ExecuteLayData(this SQLHelper sqlHelper, string sql, QueryBuilder qb)
        #region 
        {
            DataTable dt = sqlHelper.ExecuteDataTable(sql, qb);
            LayData layData = new LayData(dt, qb.TotolCount);
            return layData;
        }
        #endregion

        /// <summary>
        /// LayUI通用版
        /// </summary>
        /// <param name="sqlHelper"></param>
        /// <param name="sql"></param>
        /// <param name="qb"></param>
        /// <param name="orderby"></param>
        /// <returns></returns>
        public static DataTable ExecuteDataTable(this SQLHelper sqlHelper, string sql, QueryBuilder qb)
        #region 
        {
            try
            {
                //TODO 重量级，权限自动过滤
                // SearchCondition authCnd = FormulaHelper.CreateAuthDataFilter();
                // SearchCondition corpCnd = CreateCorpAuth(sqlHelper, sql);
                // sql = string.Format("select * from ({0}) sourceTable1 where 1=1 {1} {2}", sql, authCnd.GetWhereString(false), corpCnd.GetWhereString(false));

                sql = string.Format("select {2} from ({0}) sourceTable {1}", sql, qb.GetWhereString(), qb.Fields);

                string orderby = "";
                string[] qbSortFields = qb.SortField.Split(',');
                string[] qbSortOrders = qb.SortOrder.Split(',');
                for (int i = 0; i < qbSortFields.Length; i++)
                {
                    qbSortFields[i] += " " + qbSortOrders[i];
                }
                string qbOrderBy = string.Join(",", qbSortFields);

                if (string.IsNullOrEmpty(orderby))
                {
                    orderby = "order by " + qbOrderBy;
                }

                if (qb.limit <= 0)
                {
                    DataTable dt = sqlHelper.ExecuteDataTable(sql + " " + orderby);
                    qb.TotolCount = dt.Rows.Count;
                    return dt;
                }
                else
                {
                    object totalCount = sqlHelper.ExecuteScalar(string.Format("select count(1) from ({0}) tableCount", sql));
                    qb.TotolCount = Convert.ToInt32(totalCount);

                    int start = (qb.page - 1) * qb.limit + 1;//下标从1开始
                    int end = start + qb.limit - 1;

                    if (start > qb.TotolCount)
                    {
                        start = 0;
                        end = qb.limit - 1;
                        qb.limit = 0;
                    }

                    sql = string.Format(@"select * from (select tempTable1.*, Row_number() over({1}) as RowNumber from ({0}) tempTable1) tmpTable2 where RowNumber between {2} and {3}", sql, orderby, start, end);

                    return sqlHelper.ExecuteDataTable(sql);
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion

    }
}
