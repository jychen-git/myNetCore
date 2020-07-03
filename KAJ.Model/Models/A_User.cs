using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace KAJ.Model.Models
{
	 ///<summary>
	 ///A_User
	 ///</summary>
	 [Table("A_User")]	
	 public class A_User:BaseModel
	 {
	  public const string _thisTableName = "A_User";
	 
		 /// <summary>
        /// 主键ID
        /// </summary>
		[Key]
		[Required]
		public string ID { get; set; } 
		public const string _ID ="ID";
		
	
		 /// <summary>
        /// 用户账号
        /// </summary>
		public string Code { get; set; } 
		public const string _Code ="Code";
		
	
		 /// <summary>
        /// 用户名称
        /// </summary>
		public string Name { get; set; } 
		public const string _Name ="Name";
		
	
		 /// <summary>
        /// 用户密码，MD5加密
        /// </summary>
		public string PassWord { get; set; } 
		public const string _PassWord ="PassWord";
		
	
		 /// <summary>
        /// 创建时间
        /// </summary>
		public DateTime? CreateTime { get; set; } 
		public const string _CreateTime ="CreateTime";
		
	 
	 }
}	 
