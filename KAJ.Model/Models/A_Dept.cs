using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace KAJ.Model.Models
{
	 ///<summary>
	 ///A_Dept
	 ///</summary>
	 [Table("A_Dept")]	
	 public class A_Dept:BaseModel
	 {
	  public const string _thisTableName = "A_Dept";
	 
		 /// <summary>
        /// 主键ID
        /// </summary>
		[Key]
		[Required]
		public string ID { get; set; } 
		public const string _ID ="ID";
		
	
		 /// <summary>
        /// 父级ID
        /// </summary>
		public string ParentID { get; set; } 
		public const string _ParentID ="ParentID";
		
	
		 /// <summary>
        /// 部门编号
        /// </summary>
		[Required]
		public string Code { get; set; } 
		public const string _Code ="Code";
		
	
		 /// <summary>
        /// 部门名称
        /// </summary>
		public string Name { get; set; } 
		public const string _Name ="Name";
		
	 
	 }
}	 
