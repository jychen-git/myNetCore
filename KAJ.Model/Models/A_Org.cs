using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace KAJ.Model.Models
{
	 ///<summary>
	 ///A_Org
	 ///</summary>
	 [Table("A_Org")]	
	 public class A_Org
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
		public string Code { get; set; }
	
		 /// <summary>
        /// Name
        /// </summary>
		public string Name { get; set; }
	 
	 }
}	 
