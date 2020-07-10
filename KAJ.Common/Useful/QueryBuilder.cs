using System;
using System.Collections.Generic;
using System.Text;

namespace KAJ.Common.Useful
{
    public class QueryBuilder : SearchCondition
    {
        /// <summary>
        /// 当前页面索引layui
        /// </summary>
        public int page { get; set; }

        /// <summary>
        /// 每页多少记录layui
        /// </summary>
        public int limit { get; set; }

        /// <summary>
        /// 当前页面索引miniui
        /// </summary>
        public int PageIndex { get; set; }

        /// <summary>
        /// 每页多少记录miniui
        /// </summary>
        public int PageSize { get; set; }


        /// <summary>
        /// 排序字段
        /// </summary>
        public string SortField { get; set; } = "ID";

        /// <summary>
        /// 排序规则
        /// </summary>
        public string SortOrder { get; set; } = "DESC";

        /// <summary>
        /// 总记录数
        /// </summary>
        public int TotolCount { get; set; }

        /// <summary>
        /// 是否默认排序
        /// </summary>
        public bool DefaultSort { get; set; }

        public void SetSort(string sortField, string sortOrder)
        {
            if (this.DefaultSort)
            {
                this.SortField = sortField;
                this.SortOrder = sortOrder;
            }
        }
    }
}