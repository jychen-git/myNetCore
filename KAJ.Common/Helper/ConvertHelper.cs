using System;
using System.Collections.Generic;
using System.Text;

namespace KAJ.Common.Helper
{
    public static class ConvertHelper
    {

        /// <summary>
        /// 对象转整型
        /// </summary>
        /// <param name="thisValue">任意值</param>
        /// <param name="errorValue">非法时指定返回值</param>
        /// <returns></returns>
        public static int ToObjInt(this object thisValue, int errorValue = 0)
        {
            int reval = 0;
            if (thisValue != null && thisValue != DBNull.Value && int.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }
            return errorValue;
        }

        /// <summary>
        /// 对象转浮点型
        /// </summary>
        /// <param name="thisValue">任意值</param>
        /// <param name="errorValue">非法时指定返回值</param>
        /// <returns></returns>
        public static double ToObjMoney(this object thisValue, double errorValue = 0d)
        {
            double reval = 0;
            if (thisValue != null && thisValue != DBNull.Value && double.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }
            return errorValue;
        }

        /// <summary>
        /// 任意值转字符
        /// </summary>
        /// <param name="thisValue">任意值</param>
        /// <param name="errorValue">非法时指定返回值</param>
        /// <returns></returns>
        public static string ToObjString(this object thisValue, string errorValue = "")
        {
            if (thisValue != null) return thisValue.ToString().Trim();
            return errorValue;
        }

        /// <summary>
        /// 任意值转数字
        /// </summary>
        /// <param name="thisValue">任意值</param>
        /// <param name="errorValue">非法时指定返回值</param>
        /// <returns></returns>
        public static Decimal ToObjDecimal(this object thisValue, decimal errorValue = 0)
        {
            Decimal reval = 0;
            if (thisValue != null && thisValue != DBNull.Value && decimal.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }
            return errorValue;
        }

        /// <summary>
        /// 任意值转时间
        /// </summary>
        /// <param name="thisValue">任意值</param>
        /// <param name="errorValue">非法时指定返回值</param>
        /// <returns></returns>
        public static DateTime ToObjDate(this object thisValue, DateTime errorValue)
        {
            errorValue = DateTime.Now;
            DateTime reval = DateTime.MinValue;
            if (thisValue != null && thisValue != DBNull.Value && DateTime.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }
            return errorValue;
        }
        /// <summary>
        /// 任意值转Bool
        /// </summary>
        /// <param name="thisValue">任意值</param>
        /// <returns></returns>
        public static bool ToObjBool(this object thisValue)
        {
            bool reval = false;
            if (thisValue != null && thisValue != DBNull.Value && bool.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }
            return reval;
        }
    }
}
