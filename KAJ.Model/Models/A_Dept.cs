using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Blog.Core.Model.Models
{
	 ///<summary>
	 ///A_Dept
	 ///</summary>
	 [Table("A_Dept")]	
	 public class A_Dept
	 {
	 
		 /// <summary>
        /// ID
        /// </summary>
		[Key]
		[Required]
		public string ID { get; set; }
	
		 /// <summary>
        /// ParentID
        /// </summary>
		public string ParentID { get; set; }
	
		 /// <summary>
        /// Code
        /// </summary>
		[Required]
		public string Code { get; set; }
	
		 /// <summary>
        /// Name
        /// </summary>
		public string Name { get; set; }
	 
	 }
}	 
