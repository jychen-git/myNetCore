using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Blog.Core.Model.Models
{
	 ///<summary>
	 ///A_User
	 ///</summary>
	 [Table("A_User")]	
	 public class A_User
	 {
	 
		 /// <summary>
        /// ID
        /// </summary>
		[Key]
		[Required]
		public string ID { get; set; }
	
		 /// <summary>
        /// Code
        /// </summary>
		public string Code { get; set; }
	
		 /// <summary>
        /// Name
        /// </summary>
		public string Name { get; set; }
	
		 /// <summary>
        /// PassWord
        /// </summary>
		public string PassWord { get; set; }
	
		 /// <summary>
        /// CreateTime
        /// </summary>
		public DateTime? CreateTime { get; set; }
	 
	 }
}	 
