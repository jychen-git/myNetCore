using System;
using System.Collections.Generic;
using System.Text;

namespace KAJ.Model
{
    public class PageModel<T>
    {
        /// <summary>
        /// 状态码
        /// </summary>
        public int code { get; set; } = 0;

        /// <summary>
        /// 消息
        /// </summary>
        public string msg { get; set; }
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
        /// 返回数据
        /// </summary>
        public List<T> data { get; set; }
    }
}
