using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace KAJ.Model.Models
{
	 ///<summary>
	 ///A_Org
	 ///</summary>
	 [Table("A_Org")]	
	 public class A_Org:BaseModel
	 {
	  public const string _thisTableName = "A_Org";
	 
		 /// <summary>
        /// ID
        /// </summary>
		[Key]
		[Required]
		public string ID { get; set; } 
		public const string _ID ="ID";
		
	
		 /// <summary>
        /// ParentID
        /// </summary>
		public string ParentID { get; set; } 
		public const string _ParentID ="ParentID";
		
	
		 /// <summary>
        /// Code
        /// </summary>
		public string Code { get; set; } 
		public const string _Code ="Code";
		
	
		 /// <summary>
        /// Name
        /// </summary>
		public string Name { get; set; } 
		public const string _Name ="Name";
		
	
		 /// <summary>
        /// Remark
        /// </summary>
		public string Remark { get; set; } 
		public const string _Remark ="Remark";
		
	 
	 }
}	 
