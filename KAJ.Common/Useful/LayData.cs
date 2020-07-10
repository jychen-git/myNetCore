using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace KAJ.Common.Useful
{
    /// <summary>
    /// 与Model.PageModel实现一样的功能
    /// LayUI返回分页数据，DataTable格式的数据
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class LayData
    {
        public LayData(DataTable list, int total)
        {
            data = list;
            count = total;
        }
        /// <summary>
        /// 状态码
        /// </summary>
        public int code { get; set; } = 0;

        /// <summary>
        /// 消息
        /// </summary>
        public string msg { get; set; } = "";
        /// <summary>
        /// 当前页
        /// </summary>
        public int pageIndex { get; set; } = 1;
        /// <summary>
        /// 多少页
        /// </summary>

        public int pageCount { get; set; } = 1;

        /// <summary>
        /// 每页大小
        /// </summary>
        public int pageSize { set; get; } = 20;
        /// <summary>
        /// 数据总数
        /// </summary>
        public int count { get; set; } = 0;

        /// <summary>
        /// 返回数据DataTable
        /// </summary>
        public DataTable data { get; set; }
    }
}