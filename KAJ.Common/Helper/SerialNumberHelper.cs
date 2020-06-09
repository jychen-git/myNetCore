using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace KAJ.Common.Helper
{
    public class SerialNumberHelper
    {
        [Flags]
        public enum SerialNumberResetRule
        {
            Code = 1,
            YearCode = 2,
            MonthCode = 4,
            DayCode = 8,
            CategoryCode = 16,
            SubCategoryCode = 32,
            OrderNumCode = 64,
            PrjCode = 128,
            OrgCode = 256,
            UserCode = 512,
        }

        public static int GetSerialNumber(SerialNumberParam param, SerialNumberResetRule rule = SerialNumberResetRule.YearCode | SerialNumberResetRule.MonthCode, bool applySerialNumber = false)
        {
            int number = 0;
            #region 转换重复规则

            var mode = new Dictionary<string, string>();
            if (param == null)
                mode.Add("Code", "");
            else
                mode.Add("Code", param.Code);

            if (SerialNumberResetRule.YearCode == (rule & SerialNumberResetRule.YearCode))
                mode.Add("YearCode", DateTime.Now.Year.ToString());
            if (SerialNumberResetRule.MonthCode == (rule & SerialNumberResetRule.MonthCode))
                mode.Add("MonthCode", DateTime.Now.Month.ToString());
            if (SerialNumberResetRule.DayCode == (rule & SerialNumberResetRule.DayCode))
                mode.Add("DayCode", DateTime.Now.Day.ToString());
            if (SerialNumberResetRule.CategoryCode == (rule & SerialNumberResetRule.CategoryCode))
                mode.Add("CategoryCode", param.CategoryCode);
            if (SerialNumberResetRule.SubCategoryCode == (rule & SerialNumberResetRule.SubCategoryCode))
                mode.Add("SubCategoryCode", param.SubCategoryCode);
            if (SerialNumberResetRule.OrderNumCode == (rule & SerialNumberResetRule.OrderNumCode))
                mode.Add("OrderNumCode", param.OrderNumCode);
            if (SerialNumberResetRule.PrjCode == (rule & SerialNumberResetRule.PrjCode))
                mode.Add("PrjCode", param.PrjCode);
            if (SerialNumberResetRule.OrgCode == (rule & SerialNumberResetRule.OrgCode))
                mode.Add("OrgCode", param.OrgCode);
            if (SerialNumberResetRule.UserCode == (rule & SerialNumberResetRule.UserCode))
                mode.Add("UserCode", param.UserCode);

            #endregion




            SQLHelper sqlHelper = SQLHelper.CreateSqlHelper();
            if (applySerialNumber)
            {
                #region 申请流水号，更新流水号自增1，并返回结果
                //申请流水号时为了预防脏读及数据库死锁，改为先自增再查询
                string sql = "select count(0) from S_UI_SerialNumber where 1=1 ";
                foreach (var item in mode)
                    sql += string.Format(" and {0}='{1}'", item.Key, item.Value);
                var obj = Convert.ToInt32(sqlHelper.ExecuteScalar(sql));
                if (obj > 0)
                {
                    sql = "update S_UI_SerialNumber set Number=Number+1 where 1=1 ";
                    foreach (var item in mode)
                        sql += string.Format(" and {0}='{1}'", item.Key, item.Value);

                    sql += ";select Number from S_UI_SerialNumber where 1=1";
                    foreach (var item in mode)
                        sql += string.Format(" and {0}='{1}'", item.Key, item.Value);
                    var numobj = sqlHelper.ExecuteScalar(sql);
                    number = numobj == null || numobj == DBNull.Value ? 1 : Convert.ToInt32(numobj);
                }
                else
                {
                    string fields = "";
                    string values = "";
                    foreach (var item in mode)
                    {
                        fields += "," + item.Key;
                        values += ",'" + item.Value + "'";
                    }
                    number++;
                    sql = string.Format("insert into S_UI_SerialNumber (ID,Number{2}) VALUES('{0}','{1}'{3})"
                        , GuidHelper.CreateGuid()
                        , number
                        , fields
                        , values);
                    sqlHelper.ExecuteScalar(sql);
                }
                #endregion
            }
            else
            {
                #region 仅获取一个流水号，不做自增更新
                string sql = "select Number from S_UI_SerialNumber where 1=1";
                foreach (var item in mode)
                    sql += string.Format(" and {0}='{1}'", item.Key, item.Value);
                object obj = sqlHelper.ExecuteScalar(sql);
                if (obj != null)
                    number = Convert.ToInt32(obj);
                number++;
                #endregion
            }
            return number;
        }

        public static string GetSerialNumberString(string tmpl, SerialNumberParam param, string serialNumberResetRule, bool applySerialNumber = false)
        {
            SerialNumberResetRule rule = SerialNumberResetRule.Code;
            foreach (var item in serialNumberResetRule.Split(','))
            {
                if (item == "") continue;
                var e = (SerialNumberResetRule)Enum.Parse(typeof(SerialNumberResetRule), item);
                rule = rule | e;
            }

            return GetSerialNumberString(tmpl, param, rule, applySerialNumber);

        }

        public static string GetSerialNumberString(string tmpl, SerialNumberParam param, SerialNumberResetRule rule = SerialNumberResetRule.YearCode | SerialNumberResetRule.MonthCode, bool applySerialNumber = false)
        {
            int number = GetSerialNumber(param, rule, applySerialNumber);

            Regex reg = new Regex("\\{[0-9a-zA-Z_\u4e00-\u9faf]*\\}");
            string result = reg.Replace(tmpl, (Match m) =>
            {
                string value = m.Value.Trim('{', '}');

                if (value.Replace('N', ' ').Trim() == "") //顺序号
                    return number.ToString("D" + value.Length);

                switch (value)
                {
                    case "yyyy":
                    case "YYYY":
                        return DateTime.Now.ToString("yyyy");
                    case "yy":
                    case "YY":
                        return DateTime.Now.ToString("yy");
                    case "mm":
                    case "MM":
                        return DateTime.Now.ToString("MM");
                    case "dd":
                    case "DD":
                        return DateTime.Now.ToString("dd");
                    case "PrjCode":
                        return param.PrjCode;
                    case "OrgCode":
                        return param.OrgCode;
                    case "UserCode":
                        return param.UserCode;
                    case "CategoryCode":
                        return param.CategoryCode;
                    case "SubCategoryCode":
                        return param.SubCategoryCode;
                    case "OrderNumCode":
                        return param.OrderNumCode;
                }
                return m.Value;
            });


            return result;
        }

        public static bool UpdateSerialNumber(SerialNumberParam param, string serialNumberResetRule, int number)
        {
            SerialNumberResetRule rule = SerialNumberResetRule.Code;
            foreach (var item in serialNumberResetRule.Split(','))
            {
                if (item == "") continue;
                var e = (SerialNumberResetRule)Enum.Parse(typeof(SerialNumberResetRule), item);
                rule = rule | e;
            }

            #region 转换重复规则

            var mode = new Dictionary<string, string>();
            if (param == null)
                mode.Add("Code", "");
            else
                mode.Add("Code", param.Code);

            mode.Add("YearCode", SerialNumberResetRule.YearCode == (rule & SerialNumberResetRule.YearCode) ? DateTime.Now.Year.ToString() : "");
            mode.Add("MonthCode", SerialNumberResetRule.MonthCode == (rule & SerialNumberResetRule.MonthCode) ? DateTime.Now.Month.ToString() : "");
            mode.Add("DayCode", SerialNumberResetRule.DayCode == (rule & SerialNumberResetRule.DayCode) ? DateTime.Now.Day.ToString() : "");
            mode.Add("CategoryCode", SerialNumberResetRule.CategoryCode == (rule & SerialNumberResetRule.CategoryCode) ? param.CategoryCode : "");
            mode.Add("SubCategoryCode", SerialNumberResetRule.SubCategoryCode == (rule & SerialNumberResetRule.SubCategoryCode) ? param.SubCategoryCode : "");
            mode.Add("OrderNumCode", SerialNumberResetRule.OrderNumCode == (rule & SerialNumberResetRule.OrderNumCode) ? param.OrderNumCode : "");
            mode.Add("PrjCode", SerialNumberResetRule.PrjCode == (rule & SerialNumberResetRule.PrjCode) ? param.PrjCode : "");
            mode.Add("OrgCode", SerialNumberResetRule.OrgCode == (rule & SerialNumberResetRule.OrgCode) ? param.OrgCode : "");
            mode.Add("UserCode", SerialNumberResetRule.UserCode == (rule & SerialNumberResetRule.UserCode) ? param.UserCode : "");

            #endregion

            SQLHelper sqlHelper = SQLHelper.CreateSqlHelper();
            string sql = "update S_UI_SerialNumber set Number={0} where 1=1 ";
            foreach (var item in mode)
            {
                if (!string.IsNullOrEmpty(item.Value))
                    sql += string.Format(" and {0}='{1}'", item.Key, item.Value);
                else
                    sql += string.Format(" and isnull({0},'')=''", item.Key);
            }
            var obj = Convert.ToInt32(sqlHelper.ExecuteScalar(string.Format(sql, number)));
            return obj > 0;
        }
    }

    public class SerialNumberParam
    {
        public string Code { get; set; }
        public string PrjCode { get; set; }
        public string OrgCode { get; set; }
        public string UserCode { get; set; }
        public string CategoryCode { get; set; }
        public string SubCategoryCode { get; set; }
        public string OrderNumCode { get; set; }
    }
}
