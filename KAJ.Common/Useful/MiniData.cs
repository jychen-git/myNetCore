using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace KAJ.Common.Useful
{
    /// <summary>
    /// MiniUI的DataGrid
    /// </summary>
    public class MiniData
    {
        public MiniData(object list, int count)
        {
            data = list;
            total = count;
            sumData = new Dictionary<string, object>();
            avgData = new Dictionary<string, object>();
        }
        /// <summary>
        /// 总条数.
        /// </summary>
        public int total { get; set; }
        /// <summary>
        /// Grid表单数据.
        /// </summary>
        public object data { get; set; }

        /// <summary>
        /// 汇总数据集合
        /// </summary>
        public Dictionary<string, object> sumData { get; set; }

        /// <summary>
        /// 平均值数据集合
        /// </summary>
        public Dictionary<string, object> avgData { get; set; }
    }
}