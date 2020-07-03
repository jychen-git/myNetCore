using System;
using System.Collections.Generic;
using System.Text;

namespace KAJ.Common.Useful
{
    public class QueryBuilder : SearchCondition
    {
        /// <summary>
        /// 当前页面索引
        /// </summary>
        public int PageIndex { get; set; }

        public int page { get; set; }

        public int limit { get; set; }

        /// <summary>
        /// 每页多少记录
        /// </summary>
        public int PageSize { get; set; }


        private string _sortField;
        /// <summary>
        /// 排序字段
        /// </summary>
        public string SortField { get { return _sortField; } set { _sortField = value; DefaultSort = false; } }

        /// <summary>
        /// 排序规则
        /// </summary>
        public string SortOrder { get; set; }

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