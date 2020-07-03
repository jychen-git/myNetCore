using System;
using System.Collections.Generic;
using System.Text;

namespace KAJ.Model
{
    /// <summary>
    /// 通用返回信息类
    /// </summary>
    public class ResponseModel<T>
    {
        /// <summary>
        /// Layui的成功码
        /// </summary>
        public int code { get; set; } = 0;
        /// <summary>
        /// 状态码
        /// </summary>
        public int status { get; set; } = 200;
        /// <summary>
        /// 操作是否成功
        /// </summary>
        public bool success { get; set; } = false;
        /// <summary>
        /// 返回信息
        /// </summary>
        public string msg { get; set; } = "服务器异常";
        /// <summary>
        /// 返回数据集合
        /// </summary>
        public T data { get; set; }
        /// <summary>
        /// 数据总数
        /// </summary>
        public int count { get; set; } = 0;

    }
}
