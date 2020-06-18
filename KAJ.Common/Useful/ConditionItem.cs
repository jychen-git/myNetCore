using System;
using System.Collections.Generic;
using System.Text;

namespace KAJ.Common.Useful
{
    public class ConditionItem
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public ConditionItem()
        { }

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="field">字段名称</param>
        /// <param name="method">运算符</param>
        /// <param name="val">实体值</param>
        public ConditionItem(string field, QueryMethod method, object val)
        {
            Field = field;
            Method = method;
            Value = val;
        }

        /// <summary>
        /// 字段名称
        /// </summary>
        public string Field { get; set; }

        /// <summary>
        /// 运算符
        /// </summary>
        public QueryMethod Method { get; set; }

        /// <summary>
        /// 值
        /// </summary>
        public object Value { get; set; }

        /// <summary>
        /// 不同OrGroup间为and关系，相同OrGroup间为or关系（为了规约模式的or）
        /// </summary>
        public string OrGroup { get; set; }

        /// <summary>
        /// 不同BaseOrGroup间为Or关系，相同BaseOrGroup间的关系由OrGroup决定（为了实现业务，数据权限组间为Or关系）
        /// </summary>
        public string BaseOrGroup { get; set; }
    }


    /// <summary>
    /// 查询运算符
    /// </summary>
    public enum QueryMethod
    {
        /// <summary>
        /// 等于
        /// </summary>
        Equal = 0,

        /// <summary>
        /// 小于
        /// </summary>
        LessThan = 1,

        /// <summary>
        /// 大于
        /// </summary>
        GreaterThan = 2,

        /// <summary>
        /// 小于等于
        /// </summary>
        LessThanOrEqual = 3,

        /// <summary>
        /// 大于等于
        /// </summary>
        GreaterThanOrEqual = 4,

        /// <summary>
        /// Like
        /// </summary>
        Like = 6,

        /// <summary>
        /// In
        /// </summary>
        In = 7,

        /// <summary>
        /// 输入一个时间获取当前天的时间块操作, ToSql未实现，仅实现了IQueryable
        /// </summary>
        DateBlock = 8,

        /// <summary>
        /// 不等于
        /// </summary>
        NotEqual = 9,

        /// <summary>
        ///以....开始
        /// </summary>
        StartsWith = 10,

        /// <summary>
        /// 以....结束
        /// </summary>
        EndsWith = 11,

        /// <summary>
        /// 处理Like的问题
        /// </summary>
        [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
        Contains = 12,

        /// <summary>
        /// 处理In的问题
        /// </summary>
        [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
        StdIn = 13,

        /// <summary>
        /// 处理Datetime小于+23h59m59s999f的问题
        /// </summary>
        [System.ComponentModel.EditorBrowsable(System.ComponentModel.EditorBrowsableState.Never)]
        DateTimeLessThanOrEqual = 14,

        Between = 15,

        InLike = 16,

        NotIn = 17,

        /// <summary>
        /// 查询空
        /// </summary>
        IsEmpty = 18
    }

    public enum SortMode
    {
        Asc, Desc
    }
}
