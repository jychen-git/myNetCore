using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace KAJ.Model.Models
{
	 ///<summary>
	 ///A_User
	 ///</summary>
	 [Table("A_User")]	
	 public class A_User
	 {
	 
		 /// <summary>
        /// 主键ID
        /// </summary>
		[Key]
		[Required]
		public string ID { get; set; }
	
		 /// <summary>
        /// 用户账号
        /// </summary>
		public string Code { get; set; }
	
		 /// <summary>
        /// 用户名称
        /// </summary>
		public string Name { get; set; }
	
		 /// <summary>
        /// 用户密码，MD5加密
        /// </summary>
		public string PassWord { get; set; }
	
		 /// <summary>
        /// 创建时间
        /// </summary>
		public DateTime? CreateTime { get; set; }
	 
	 }
}	 
