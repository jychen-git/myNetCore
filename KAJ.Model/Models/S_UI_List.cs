using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace KAJ.Model.Models
{
	 ///<summary>
	 ///S_UI_List
	 ///</summary>
	 [Table("S_UI_List")]	
	 public class S_UI_List
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
        /// ConnName
        /// </summary>
		public string ConnName { get; set; }
	
		 /// <summary>
        /// SQL
        /// </summary>
		public string SQL { get; set; }
	
		 /// <summary>
        /// TableNames
        /// </summary>
		public string TableNames { get; set; }
	
		 /// <summary>
        /// Script
        /// </summary>
		public string Script { get; set; }
	
		 /// <summary>
        /// ScriptText
        /// </summary>
		public string ScriptText { get; set; }
	
		 /// <summary>
        /// HasRowNumber
        /// </summary>
		public string HasRowNumber { get; set; }
	
		 /// <summary>
        /// LayoutGrid
        /// </summary>
		public string LayoutGrid { get; set; }
	
		 /// <summary>
        /// LayoutField
        /// </summary>
		public string LayoutField { get; set; }
	
		 /// <summary>
        /// LayoutSearch
        /// </summary>
		public string LayoutSearch { get; set; }
	
		 /// <summary>
        /// LayoutButton
        /// </summary>
		public string LayoutButton { get; set; }
	
		 /// <summary>
        /// Settings
        /// </summary>
		public string Settings { get; set; }
	
		 /// <summary>
        /// ModifyUserID
        /// </summary>
		public string ModifyUserID { get; set; }
	
		 /// <summary>
        /// ModifyUserName
        /// </summary>
		public string ModifyUserName { get; set; }
	
		 /// <summary>
        /// ModifyTime
        /// </summary>
		public DateTime? ModifyTime { get; set; }
	
		 /// <summary>
        /// CategoryID
        /// </summary>
		public string CategoryID { get; set; }
	
		 /// <summary>
        /// Released
        /// </summary>
		public string Released { get; set; }
	
		 /// <summary>
        /// CreateUserID
        /// </summary>
		public string CreateUserID { get; set; }
	
		 /// <summary>
        /// CreateUserName
        /// </summary>
		public string CreateUserName { get; set; }
	
		 /// <summary>
        /// CreateTime
        /// </summary>
		public DateTime? CreateTime { get; set; }
	
		 /// <summary>
        /// DenyDeleteFlow
        /// </summary>
		public string DenyDeleteFlow { get; set; }
	
		 /// <summary>
        /// Collision
        /// </summary>
		public string Collision { get; set; }
	
		 /// <summary>
        /// OrderBy
        /// </summary>
		public string OrderBy { get; set; }
	
		 /// <summary>
        /// HasCheckboxColumn
        /// </summary>
		public string HasCheckboxColumn { get; set; }
	
		 /// <summary>
        /// DefaultValueSettings
        /// </summary>
		public string DefaultValueSettings { get; set; }
	
		 /// <summary>
        /// CompanyID
        /// </summary>
		public string CompanyID { get; set; }
	
		 /// <summary>
        /// CompanyName
        /// </summary>
		public string CompanyName { get; set; }
	 
	 }
}	 
