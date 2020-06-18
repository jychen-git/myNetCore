using KAJ.Common.DB;
using KAJ.Common.Useful;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace KAJ.Common.Helper
{
    /// <summary>
    /// 数据库操作工具类
    /// </summary>
    public class SQLHelper
    {
        /// <summary>
        /// ADO方式新增数据
        /// </summary>
        /// <param name="tableName">目标表明</param>
        /// <param name="row">数据行</param>
        /// <returns></returns>
        public static string CreateInsertSql(string tableName, DataRow row)
        #region
        {
            StringBuilder sbFields = new StringBuilder();
            StringBuilder sbValues = new StringBuilder();
            foreach (DataColumn col in row.Table.Columns)
            {
                if (row[col] is DBNull)
                    continue;
                sbFields.AppendFormat(",{0}", col.ColumnName);
                sbValues.AppendFormat(",'{0}'", row[col].ToString().Replace("'", "''"));
            }
            string result = @"INSERT INTO [{2}] ({0}) VALUES ({1})";
            result = string.Format(result, sbFields.ToString().Trim(','), sbValues.ToString().Trim(','), tableName);
            return result;
        }

        public static string CreateInsertSql(string tableName, DataTable dt)
        {
            StringBuilder sb = new StringBuilder();
            foreach (DataRow row in dt.Rows)
            {
                StringBuilder sbFields = new StringBuilder();
                StringBuilder sbValues = new StringBuilder();
                foreach (DataColumn col in dt.Columns)
                {
                    if (row[col] is DBNull)
                        continue;
                    if (col.DataType.Name != "Decimal" || !string.IsNullOrEmpty(row[col].ToString()))
                    {
                        sbFields.AppendFormat(",{0}", col.ColumnName);
                        sbValues.AppendFormat(",'{0}'", row[col].ToString().Replace("'", "''"));
                    }
                }
                string result = @"
INSERT INTO [{2}]
           ({0}) 
          VALUES
           ({1})
";
                result = string.Format(result, sbFields.ToString().Trim(','), sbValues.ToString().Trim(','), tableName);
                sb.AppendLine(result);
            }

            return sb.ToString();
        }

        #endregion

        /// <summary>
        /// ADO方式更新数据
        /// </summary>
        /// <param name="tableName">目标表明</param>
        /// <param name="row">数据行</param>
        /// <returns></returns>
        public static string CreateUpdateSql(string tableName, DataRow row)
        #region
        {
            StringBuilder sbFields = new StringBuilder();
            StringBuilder sbValues = new StringBuilder();
            StringBuilder sbFV = new StringBuilder();
            foreach (DataColumn col in row.Table.Columns)
            {
                if (col.DataType.Name == "DateTime" && row[col] is DBNull)
                {

                }
                else if (col.DataType.Name != "Decimal" || !string.IsNullOrEmpty(row[col].ToString()))
                {
                    sbFields.AppendFormat(",{0}", col.ColumnName);
                    sbValues.AppendFormat(",'{0}'", row[col].ToString().Replace("'", "''"));
                    if (col.ColumnName != "ID")
                        sbFV.AppendFormat(",{0}='{1}'", col.ColumnName, row[col].ToString().Replace("'", "''"));
                }
            }


            string insertSql = string.Format("INSERT INTO [{2}]({0}) VALUES ({1})", sbFields.ToString().Trim(','), sbValues.ToString().Trim(','), tableName);
            string updateSql = string.Format(@"UPDATE {0} SET {2} WHERE ID='{1}'", tableName, row["ID"], sbFV.ToString().Trim(','));

            string sql = string.Format(@"
                                        if not exists (select * from {0} where ID='{1}')
                                            {2}
                                        else
                                            {3}
                                        ", tableName, row["ID"], insertSql, updateSql);

            return sql;
        }
        #endregion

        /// <summary>
        /// ADO方式更新数据
        /// </summary>
        /// <param name="tableName">目标表明</param>
        /// <param name="row">数据</param>
        /// <returns></returns>
        public static string CreateUpdateSql(string tableName, DataTable dt)
        #region
        {
            StringBuilder sb = new StringBuilder();
            foreach (DataRow row in dt.Rows)
            {
                sb.Append(CreateUpdateSql(tableName, row));
            }
            return sb.ToString();
        }
        #endregion


        /// <summary>
        /// 静态构造方法
        /// </summary>
        /// <param name="connName">指定数据库</param>
        /// <returns></returns>
        public static SQLHelper CreateSqlHelper(string connName = "KAJ_Base")
        #region
        {
            SQLHelper sqlHelper = sqlHelper = new SQLHelper(BaseDBConfig.GetConnectionString(connName));
            return sqlHelper;
        }

        #region ExecuteNonQueryWithTrans

        /// <summary>
        /// 将cmdText在一个事务中执行
        /// </summary>
        /// <param name="cmdText"></param>
        /// <returns></returns>
        public string ExecuteNonQueryWithTrans(string cmdText)
        {
            string retVal = "0";
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                cmd.CommandType = CommandType.Text;

                try
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    using (SqlTransaction trans = conn.BeginTransaction())
                    {
                        try
                        {
                            cmd.Transaction = trans;
                            retVal = cmd.ExecuteNonQuery().ToString();
                            trans.Commit();
                        }
                        catch { trans.Rollback(); throw; }
                    }


                }
                catch (Exception exp)
                {
                    //retVal = exp.Message;
                    throw exp;
                }
                finally
                {
                    conn.Close();
                }
            }
            return retVal;
        }

        #endregion

        #region 执行并将结果转换为对象

        public T ExecuteObject<T>(string sql, T obj = null) where T : class, new()
        {
            DataTable dt = this.ExecuteDataTable(sql);
            if (dt.Rows.Count > 0)
                return RowToObj<T>(dt.Rows[0], obj);
            return obj;
        }

        public List<T> ExecuteList<T>(string sql) where T : class, new()
        {
            List<T> list = new List<T>();

            DataTable dt = this.ExecuteDataTable(sql);
            foreach (DataRow row in dt.Rows)
            {
                T obj = RowToObj<T>(row, null);
                list.Add(obj);
            }

            return list;
        }

        #endregion



        #region 私有方法

        public T RowToObj<T>(DataRow row, T obj = null) where T : class, new()
        {
            if (obj == null)
                obj = new T();

            foreach (var pi in typeof(T).GetProperties())
            {
                if (!row.Table.Columns.Contains(pi.Name))
                    continue;
                if (row[pi.Name] != System.DBNull.Value)
                    pi.SetValue(obj, row[pi.Name], null);
            }

            return obj;
        }

        #endregion

        #endregion

        /// <summary>
        /// 数据库连接字符串
        /// </summary>
        public SQLHelper(string connStr)
        #region 
        {
            this.connStr = connStr;
        }
        private string connStr = "";
        private string _dbName = "";

        public string ConnStr
        {
            get
            {
                return connStr;
            }
        }

        public string Name
        {
            get;
            set;
        }

        public string ShortName
        {
            get
            {
                if (String.IsNullOrEmpty(Name))
                    return string.Empty;
                return Name.Remove(0, Name.LastIndexOf('_') + 1);
            }
        }

        public string DbName
        {
            get
            {
                if (_dbName == "")
                {
                    if (connStr == "")
                        _dbName = ""; ;
                    SqlConnection conn = new SqlConnection(connStr);
                    _dbName = conn.Database;
                }
                return _dbName;
            }
        }


        #endregion

        /// <summary>
        /// SQL无返回值可操作的方法
        /// </summary>

        //带事务，带参，带SQL执行类型，无返回值的SQL执行
        public string ExecuteNonQuery(SqlTransaction tran, string cmdText, SqlParameter[] parms, CommandType cmdtype)
        #region
        {
            string retVal = "0";

            SqlCommand cmd = new SqlCommand(cmdText);
            cmd.Connection = tran.Connection;
            cmd.Transaction = tran;
            cmd.CommandType = cmdtype;
            cmd.CommandTimeout = 600;

            if (parms != null)
            {
                //添加参数
                foreach (SqlParameter parm in parms)
                {
                    cmd.Parameters.Add(parm);
                }
            }
            retVal = cmd.ExecuteNonQuery().ToString();

            return retVal;
        }


        //带连接字符串，带参，带SQL执行类型，无返回值的SQL执行
        public string ExecuteNonQuery(string constr, string cmdText, SqlParameter[] parms, CommandType cmdtype)
        {
            string retVal = "0";
            using (SqlConnection conn = new SqlConnection(constr))
            {
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                cmd.CommandType = cmdtype;

                if (parms != null)
                {
                    //添加参数
                    foreach (SqlParameter parm in parms)
                    {
                        cmd.Parameters.Add(parm);
                    }
                }
                try
                {
                    conn.Open();
                    retVal = cmd.ExecuteNonQuery().ToString();
                }
                catch (Exception exp)
                {
                    retVal = exp.Message;
                }
                finally
                {
                    conn.Close();
                }
                return retVal;
            }
        }


        //带连接，带参，带SQL执行类型，无返回值的SQL执行
        public string ExecuteNonQuery(SqlConnection conn, string cmdText, SqlParameter[] parms, CommandType cmdtype)
        {
            string retVal = "0";
            SqlCommand cmd = new SqlCommand(cmdText, conn);
            cmd.CommandType = cmdtype;

            if (parms != null)
            {
                //添加参数
                foreach (SqlParameter parm in parms)
                {
                    cmd.Parameters.Add(parm);
                }
            }
            try
            {
                if (conn.State != ConnectionState.Open)
                {
                    conn.Open();
                }
                retVal = cmd.ExecuteNonQuery().ToString();
            }
            catch (Exception exp)
            {
                retVal = exp.Message;
            }
            finally
            {
                conn.Close();
            }
            return retVal;
        }


        //带参，带SQL执行类型，无返回值的SQL执行
        public string ExecuteNonQuery(string cmdText, SqlParameter[] parms, CommandType cmdtype)
        {
            string retVal = "0";
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                cmd.CommandType = cmdtype;

                if (parms != null)
                {
                    //添加参数
                    foreach (SqlParameter parm in parms)
                    {
                        cmd.Parameters.Add(parm);
                    }
                }
                try
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    retVal = cmd.ExecuteNonQuery().ToString();
                }
                catch (Exception exp)
                {
                    //retVal = exp.Message;
                    throw exp;
                }
                finally
                {
                    if (conn.State == ConnectionState.Open)
                    {
                        conn.Close();
                    }
                }
            }
            return retVal;
        }


        //带SQL执行类型，无返回值的SQL执行
        public string ExecuteNonQuery(string cmdText, CommandType cmdtype)
        {
            string retVal = "0";
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                cmd.CommandType = cmdtype;

                try
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    retVal = cmd.ExecuteNonQuery().ToString();
                }
                catch (Exception exp)
                {
                    retVal = exp.Message;
                }
                finally
                {
                    conn.Close();
                }
            }
            return retVal;
        }

        //带错误输出，无返回值的SQL执行（默认是Text）
        public string ExecuteNonQuery(string cmdText)
        {
            string retVal = "0";
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                cmd.CommandType = CommandType.Text;

                try
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    retVal = cmd.ExecuteNonQuery().ToString();
                }
                catch (Exception exp)
                {
                    //retVal = exp.Message;
                    throw exp;
                }
                finally
                {
                    conn.Close();
                }
            }
            return retVal;
        }

        /// <summary>
        /// 使用DataTable 批量插入大批量数据
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="tableName"></param>
        public void BulkInsertToDB(DataTable dt, string tableName)
        {
            if (String.IsNullOrEmpty(tableName))
            {
                throw new Exception("批量插入数据表的表明不能为空");
            }
            if (dt == null)
            {
                throw new Exception("目标数据源DataTable对象为空，无法执行批量数据插入");
            }
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlBulkCopy bulkCopy = new SqlBulkCopy(conn);
                bulkCopy.DestinationTableName = tableName;
                try
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    if (dt != null && dt.Rows.Count != 0)
                        bulkCopy.WriteToServer(dt);
                }
                catch (Exception exp)
                {
                    throw exp;
                }
                finally
                {
                    conn.Close();
                }
            }
        }

        #endregion

        #region SQL有返回值可操作的方法

        //带连接，带参，带SQL执行类型，有返回值的SQL执行
        public object ExecuteScalar(SqlConnection conn, string cmdText, SqlParameter[] parms, CommandType cmdtype)
        {
            object retVal = null;

            SqlCommand cmd = new SqlCommand(cmdText, conn);
            cmd.CommandType = cmdtype;

            if (parms != null)
            {
                //添加参数
                foreach (SqlParameter parm in parms)
                {
                    cmd.Parameters.Add(parm);
                }
            }

            try
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                retVal = cmd.ExecuteScalar();
            }
            catch (Exception exp)
            {
                //retVal = (object)exp.Message;
                throw exp;
            }
            finally
            {
                conn.Close();
            }
            return retVal;
        }

        //带连接字符串，带参，带SQL执行类型，有返回值的SQL执行
        public object ExecuteScalar(string constr, string cmdText, Dictionary<string, object> dicParams, CommandType cmdtype)
        {
            List<SqlParameter> parms = new List<SqlParameter>();
            foreach (string key in dicParams.Keys)
            {
                parms.Add(new SqlParameter(key, dicParams[key]));
            }

            object retVal = null;

            using (SqlConnection conn = new SqlConnection(constr))
            {
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                cmd.CommandType = cmdtype;

                if (parms != null)
                {
                    //添加参数
                    foreach (SqlParameter parm in parms)
                    {
                        cmd.Parameters.Add(parm);
                    }
                }

                try
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    retVal = cmd.ExecuteScalar();
                }
                catch (Exception exp)
                {
                    //retVal = (object)exp.Message;
                    throw exp;
                }
                finally
                {
                    conn.Close();
                }
            }
            return retVal;
        }

        //带参，带SQL执行类型，有返回值的SQL执行
        public object ExecuteScalar(string cmdText, Dictionary<string, object> dicParams, CommandType cmdtype)
        {
            List<SqlParameter> parms = new List<SqlParameter>();
            foreach (string key in dicParams.Keys)
            {
                parms.Add(new SqlParameter(key, dicParams[key]));
            }

            object retVal = null;

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                cmd.CommandType = cmdtype;

                if (parms != null)
                {
                    //添加参数
                    foreach (SqlParameter parm in parms)
                    {
                        cmd.Parameters.Add(parm);
                    }
                }

                try
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    retVal = cmd.ExecuteScalar();
                }
                catch (Exception exp)
                {
                    //retVal = (object)exp.Message;
                    throw exp;
                }
                finally
                {
                    conn.Close();
                }
            }
            return retVal;
        }

        //带参，有返回值的SQL执行
        public object ExecuteScalar(string cmdText, CommandType cmdtype)
        {
            object retVal = null;

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                cmd.CommandType = cmdtype;

                try
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    retVal = cmd.ExecuteScalar();
                }
                catch (Exception exp)
                {
                    //retVal = (object)exp.Message;
                    throw exp;
                }
                finally
                {
                    conn.Close();
                }
            }

            return retVal;
        }

        //有返回值的SQL执行
        public object ExecuteScalar(string cmdText)
        {
            object retVal = null;

            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand(cmdText, conn);
                cmd.CommandType = CommandType.Text;

                try
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                    retVal = cmd.ExecuteScalar();
                }
                catch (Exception exp)
                {
                    //retVal = (object)exp.Message;
                    throw exp;
                }
                finally
                {
                    conn.Close();
                }
            }

            return retVal;
        }

        #endregion

        #region 返回数据读取器(DataReader)可操作的方法

        //带连接字符串，带参，带SQL执行类型，有返回值的SQL执行
        public SqlDataReader ExecuteReader(string constr, string cmdText, SqlParameter[] parms, CommandType cmdtype)
        {
            SqlDataReader reader;
            SqlConnection conn = new SqlConnection(constr);
            SqlCommand cmd = new SqlCommand(cmdText, conn);
            cmd.CommandType = cmdtype;

            if (parms != null)
            {
                //添加参数
                foreach (SqlParameter parm in parms)
                    cmd.Parameters.Add(parm);
            }
            try
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                //将关闭数据库的操作交给Read操作，即关闭了read就关闭了数据库
                reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                return reader;
            }
            catch (Exception exp)
            {
                throw exp;
            }
        }


        //带连接，带参，带SQL执行类型，有返回值的SQL执行
        public SqlDataReader ExecuteReader(SqlConnection conn, string cmdText, SqlParameter[] parms, CommandType cmdtype)
        {
            SqlDataReader reader;
            SqlCommand cmd = new SqlCommand(cmdText, conn);
            cmd.CommandType = cmdtype;

            if (parms != null)
            {
                //添加参数
                foreach (SqlParameter parm in parms)
                    cmd.Parameters.Add(parm);
            }
            try
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                //将关闭数据库的操作交给Read操作，即关闭了read就关闭了数据库
                reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                return reader;
            }
            catch (Exception exp)
            {
                throw exp;
            }
        }


        //带参，带SQL执行类型，有返回值的SQL执行
        public SqlDataReader ExecuteReader(string cmdText, SqlParameter[] parms, CommandType cmdtype)
        {
            SqlDataReader reader;
            SqlConnection conn = new SqlConnection(connStr);
            SqlCommand cmd = new SqlCommand(cmdText, conn);
            cmd.CommandType = cmdtype;

            if (parms != null)
            {
                //添加参数
                foreach (SqlParameter parm in parms)
                    cmd.Parameters.Add(parm);
            }
            try
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                //将关闭数据库的操作交给Read操作，即关闭了read就关闭了数据库
                reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                return reader;
            }
            catch (Exception exp)
            {
                throw exp;
            }
        }


        //带SQL执行类型，有返回值的SQL执行
        public SqlDataReader ExecuteReader(string cmdText, CommandType cmdtype)
        {
            SqlDataReader reader;

            SqlConnection conn = new SqlConnection(connStr);
            SqlCommand cmd = new SqlCommand(cmdText, conn);
            cmd.CommandType = cmdtype;
            try
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                return reader;
            }
            catch (Exception exp)
            {
                throw exp;
            }
        }


        //有返回值的SQL执行
        public SqlDataReader ExecuteReader(string cmdText)
        {
            SqlDataReader reader;

            SqlConnection conn = new SqlConnection(connStr);
            SqlCommand cmd = new SqlCommand(cmdText, conn);
            cmd.CommandType = CommandType.Text;
            try
            {
                if (conn.State == ConnectionState.Closed)
                {
                    conn.Open();
                }
                reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                return reader;
            }
            catch (Exception exp)
            {
                throw exp;
            }
        }


        #endregion

        #region 返回DataTable可操作的方法

        //带参，带SQL执行类型，返回DataTable的SQL执行
        public DataTable ExecuteDataTable(string cmdText, int statRowNum, int maxRowNum, CommandType cmdtype)
        {
            DataSet ds = new DataSet();
            DataTable dt = new DataTable();
            int dtflag = 0;

            SqlConnection conn = new SqlConnection(connStr);
            SqlDataAdapter apt = new SqlDataAdapter(cmdText, conn);
            apt.SelectCommand.CommandType = cmdtype;

            try
            {
                if (statRowNum == 0 && maxRowNum == 0)
                {
                    apt.Fill(dt);
                }
                else
                {
                    apt.Fill(ds, statRowNum, maxRowNum, "ThisTable");
                    dtflag = 1;
                }
            }
            catch (Exception exp)
            {
                throw exp;
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }

            if (dtflag == 1)
            {
                dt = ds.Tables["ThisTable"];
            }
            return dt;
        }

        //带参，带SQL执行类型，返回DataTable的SQL执行
        public DataTable ExecuteDataTable(string cmdText, Dictionary<string, object> dicParams, CommandType cmdtype)
        {
            List<SqlParameter> parms = new List<SqlParameter>();
            foreach (string key in dicParams.Keys)
            {
                parms.Add(new SqlParameter(key, dicParams[key]));
            }

            DataTable dt = new DataTable();

            SqlConnection conn = new SqlConnection(connStr);
            SqlDataAdapter apt = new SqlDataAdapter(cmdText, conn);
            apt.SelectCommand.CommandType = cmdtype;

            if (parms != null)
            {
                //添加参数
                foreach (SqlParameter parm in parms)
                {
                    apt.SelectCommand.Parameters.Add(parm);
                }
            }

            try
            {
                apt.Fill(dt);
            }
            catch (Exception exp)
            {
                throw exp;
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
            return dt;
        }


        //带连接字符串，带参，带SQL执行类型，返回DataTable的SQL执行
        public DataTable ExecuteDataTable(string constr, string cmdText, Dictionary<string, object> dicParams, CommandType cmdtype)
        {
            List<SqlParameter> parms = new List<SqlParameter>();
            foreach (string key in dicParams.Keys)
            {
                parms.Add(new SqlParameter(key, dicParams[key]));
            }

            DataTable dt = new DataTable();

            SqlConnection conn = new SqlConnection(constr);
            SqlDataAdapter apt = new SqlDataAdapter(cmdText, conn);
            apt.SelectCommand.CommandType = cmdtype;

            if (parms != null)
            {
                //添加参数
                foreach (SqlParameter parm in parms)
                {
                    apt.SelectCommand.Parameters.Add(parm);
                }
            }

            try
            {
                apt.Fill(dt);
            }
            catch (Exception exp)
            {
                throw exp;
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
            return dt;
        }


        //带连接，带参，带SQL执行类型，返回DataTable的SQL执行
        public DataTable ExecuteDataTable(SqlConnection conn, string cmdText, Dictionary<string, object> dicParams, CommandType cmdtype)
        {
            List<SqlParameter> parms = new List<SqlParameter>();
            foreach (string key in dicParams.Keys)
            {
                parms.Add(new SqlParameter(key, dicParams[key]));
            }

            DataTable dt = new DataTable();

            SqlDataAdapter apt = new SqlDataAdapter(cmdText, conn);
            apt.SelectCommand.CommandType = cmdtype;

            if (parms != null)
            {
                //添加参数
                foreach (SqlParameter parm in parms)
                {
                    apt.SelectCommand.Parameters.Add(parm);
                }
            }

            try
            {
                apt.Fill(dt);
            }
            catch (Exception exp)
            {
                throw exp;
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
            return dt;
        }


        //带SQL执行类型，返回DataTable的SQL执行
        public DataTable ExecuteDataTable(string cmdText, CommandType cmdtype)
        {
            DataTable dt = new DataTable();

            SqlConnection conn = new SqlConnection(connStr);
            SqlDataAdapter apt = new SqlDataAdapter(cmdText, conn);
            apt.SelectCommand.CommandType = cmdtype;
            try
            {
                apt.Fill(dt);
            }
            catch (Exception exp)
            {
                throw exp;
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
            return dt;
        }


        //返回DataTable的SQL执行
        public DataTable ExecuteDataTable(string cmdText)
        {
            DataTable dt = new DataTable();

            SqlConnection conn = new SqlConnection(connStr);
            SqlDataAdapter apt = new SqlDataAdapter(cmdText, conn);
            apt.SelectCommand.CommandType = CommandType.Text;
            try
            {
                apt.Fill(dt);
            }
            catch (Exception exp)
            {
                throw exp;
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                    conn.Close();
            }
            return dt;
        }


        #endregion

        #region [返回DataSet的SQL执行操作]
        /// <summary>
        /// 执行查询语句，返回DataSet
        /// </summary>
        public DataSet ExecuteDataSet(string cmdText)
        {
            try
            {
                using (var connection = new SqlConnection(connStr))
                {
                    DataSet ds = new DataSet();
                    connection.Open();
                    new SqlDataAdapter(cmdText, connection).Fill(ds);
                    return ds;
                }
            }
            catch (Exception err)
            {
                throw err;
            }
        }
        #endregion

        public string SqlTransfer(string sql)
        {
            return sql;
        }

    }
}
