using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace KAJ.Model.Models
{
	 ///<summary>
	 ///S_UI_List
	 ///</summary>
	 [Table("S_UI_List")]	
	 public class S_UI_List:BaseModel
	 {
	  public const string _thisTableName = "S_UI_List";
	 
		 /// <summary>
        /// ID
        /// </summary>
		[Key]
		[Required]
		public string ID { get; set; } 
		public const string _ID ="ID";
		
	
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
        /// ConnName
        /// </summary>
		public string ConnName { get; set; } 
		public const string _ConnName ="ConnName";
		
	
		 /// <summary>
        /// SQL
        /// </summary>
		public string SQL { get; set; } 
		public const string _SQL ="SQL";
		
	
		 /// <summary>
        /// TableNames
        /// </summary>
		public string TableNames { get; set; } 
		public const string _TableNames ="TableNames";
		
	
		 /// <summary>
        /// Script
        /// </summary>
		public string Script { get; set; } 
		public const string _Script ="Script";
		
	
		 /// <summary>
        /// ScriptText
        /// </summary>
		public string ScriptText { get; set; } 
		public const string _ScriptText ="ScriptText";
		
	
		 /// <summary>
        /// HasRowNumber
        /// </summary>
		public string HasRowNumber { get; set; } 
		public const string _HasRowNumber ="HasRowNumber";
		
	
		 /// <summary>
        /// LayoutGrid
        /// </summary>
		public string LayoutGrid { get; set; } 
		public const string _LayoutGrid ="LayoutGrid";
		
	
		 /// <summary>
        /// LayoutField
        /// </summary>
		public string LayoutField { get; set; } 
		public const string _LayoutField ="LayoutField";
		
	
		 /// <summary>
        /// LayoutSearch
        /// </summary>
		public string LayoutSearch { get; set; } 
		public const string _LayoutSearch ="LayoutSearch";
		
	
		 /// <summary>
        /// LayoutButton
        /// </summary>
		public string LayoutButton { get; set; } 
		public const string _LayoutButton ="LayoutButton";
		
	
		 /// <summary>
        /// Settings
        /// </summary>
		public string Settings { get; set; } 
		public const string _Settings ="Settings";
		
	
		 /// <summary>
        /// ModifyUserID
        /// </summary>
		public string ModifyUserID { get; set; } 
		public const string _ModifyUserID ="ModifyUserID";
		
	
		 /// <summary>
        /// ModifyUserName
        /// </summary>
		public string ModifyUserName { get; set; } 
		public const string _ModifyUserName ="ModifyUserName";
		
	
		 /// <summary>
        /// ModifyTime
        /// </summary>
		public DateTime? ModifyTime { get; set; } 
		public const string _ModifyTime ="ModifyTime";
		
	
		 /// <summary>
        /// CategoryID
        /// </summary>
		public string CategoryID { get; set; } 
		public const string _CategoryID ="CategoryID";
		
	
		 /// <summary>
        /// Released
        /// </summary>
		public string Released { get; set; } 
		public const string _Released ="Released";
		
	
		 /// <summary>
        /// CreateUserID
        /// </summary>
		public string CreateUserID { get; set; } 
		public const string _CreateUserID ="CreateUserID";
		
	
		 /// <summary>
        /// CreateUserName
        /// </summary>
		public string CreateUserName { get; set; } 
		public const string _CreateUserName ="CreateUserName";
		
	
		 /// <summary>
        /// CreateTime
        /// </summary>
		public DateTime? CreateTime { get; set; } 
		public const string _CreateTime ="CreateTime";
		
	
		 /// <summary>
        /// DenyDeleteFlow
        /// </summary>
		public string DenyDeleteFlow { get; set; } 
		public const string _DenyDeleteFlow ="DenyDeleteFlow";
		
	
		 /// <summary>
        /// Collision
        /// </summary>
		public string Collision { get; set; } 
		public const string _Collision ="Collision";
		
	
		 /// <summary>
        /// OrderBy
        /// </summary>
		public string OrderBy { get; set; } 
		public const string _OrderBy ="OrderBy";
		
	
		 /// <summary>
        /// HasCheckboxColumn
        /// </summary>
		public string HasCheckboxColumn { get; set; } 
		public const string _HasCheckboxColumn ="HasCheckboxColumn";
		
	
		 /// <summary>
        /// DefaultValueSettings
        /// </summary>
		public string DefaultValueSettings { get; set; } 
		public const string _DefaultValueSettings ="DefaultValueSettings";
		
	
		 /// <summary>
        /// CompanyID
        /// </summary>
		public string CompanyID { get; set; } 
		public const string _CompanyID ="CompanyID";
		
	
		 /// <summary>
        /// CompanyName
        /// </summary>
		public string CompanyName { get; set; } 
		public const string _CompanyName ="CompanyName";
		
	 
	 }
}	 
