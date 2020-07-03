using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace KAJ.Model.Models
{
	 ///<summary>
	 ///S_UI_Form
	 ///</summary>
	 [Table("S_UI_Form")]	
	 public class S_UI_Form:BaseModel
	 {
	  public const string _thisTableName = "S_UI_Form";
	 
		 /// <summary>
        /// ID
        /// </summary>
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
        /// Category
        /// </summary>
		public string Category { get; set; } 
		public const string _Category ="Category";
		
	
		 /// <summary>
        /// ConnName
        /// </summary>
		public string ConnName { get; set; } 
		public const string _ConnName ="ConnName";
		
	
		 /// <summary>
        /// TableName
        /// </summary>
		public string TableName { get; set; } 
		public const string _TableName ="TableName";
		
	
		 /// <summary>
        /// Description
        /// </summary>
		public string Description { get; set; } 
		public const string _Description ="Description";
		
	
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
        /// FlowLogic
        /// </summary>
		public string FlowLogic { get; set; } 
		public const string _FlowLogic ="FlowLogic";
		
	
		 /// <summary>
        /// HiddenFields
        /// </summary>
		public string HiddenFields { get; set; } 
		public const string _HiddenFields ="HiddenFields";
		
	
		 /// <summary>
        /// Layout
        /// </summary>
		public string Layout { get; set; } 
		public const string _Layout ="Layout";
		
	
		 /// <summary>
        /// Items
        /// </summary>
		public string Items { get; set; } 
		public const string _Items ="Items";
		
	
		 /// <summary>
        /// CalItems
        /// </summary>
		public string CalItems { get; set; } 
		public const string _CalItems ="CalItems";
		
	
		 /// <summary>
        /// Setttings
        /// </summary>
		public string Setttings { get; set; } 
		public const string _Setttings ="Setttings";
		
	
		 /// <summary>
        /// SerialNumberSettings
        /// </summary>
		public string SerialNumberSettings { get; set; } 
		public const string _SerialNumberSettings ="SerialNumberSettings";
		
	
		 /// <summary>
        /// DefaultValueSettings
        /// </summary>
		public string DefaultValueSettings { get; set; } 
		public const string _DefaultValueSettings ="DefaultValueSettings";
		
	
		 /// <summary>
        /// CategoryID
        /// </summary>
		public string CategoryID { get; set; } 
		public const string _CategoryID ="CategoryID";
		
	
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
        /// ReleaseTime
        /// </summary>
		public DateTime? ReleaseTime { get; set; } 
		public const string _ReleaseTime ="ReleaseTime";
		
	
		 /// <summary>
        /// ReleasedData
        /// </summary>
		public string ReleasedData { get; set; } 
		public const string _ReleasedData ="ReleasedData";
		
	
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
        /// Collision
        /// </summary>
		public string Collision { get; set; } 
		public const string _Collision ="Collision";
		
	
		 /// <summary>
        /// LayoutEN
        /// </summary>
		public string LayoutEN { get; set; } 
		public const string _LayoutEN ="LayoutEN";
		
	
		 /// <summary>
        /// MobileItems
        /// </summary>
		public string MobileItems { get; set; } 
		public const string _MobileItems ="MobileItems";
		
	
		 /// <summary>
        /// IsPrint
        /// </summary>
		public string IsPrint { get; set; } 
		public const string _IsPrint ="IsPrint";
		
	
		 /// <summary>
        /// MobileListSql
        /// </summary>
		public string MobileListSql { get; set; } 
		public const string _MobileListSql ="MobileListSql";
		
	
		 /// <summary>
        /// ValidateUnique
        /// </summary>
		public string ValidateUnique { get; set; } 
		public const string _ValidateUnique ="ValidateUnique";
		
	
		 /// <summary>
        /// VersionEndDate
        /// </summary>
		public DateTime? VersionEndDate { get; set; } 
		public const string _VersionEndDate ="VersionEndDate";
		
	
		 /// <summary>
        /// VersionNum
        /// </summary>
		public int? VersionNum { get; set; } 
		public const string _VersionNum ="VersionNum";
		
	
		 /// <summary>
        /// VersionDesc
        /// </summary>
		public string VersionDesc { get; set; } 
		public const string _VersionDesc ="VersionDesc";
		
	
		 /// <summary>
        /// VersionStartDate
        /// </summary>
		public DateTime? VersionStartDate { get; set; } 
		public const string _VersionStartDate ="VersionStartDate";
		
	
		 /// <summary>
        /// WebPrintJS
        /// </summary>
		public string WebPrintJS { get; set; } 
		public const string _WebPrintJS ="WebPrintJS";
		
	
		 /// <summary>
        /// LayoutPrint
        /// </summary>
		public string LayoutPrint { get; set; } 
		public const string _LayoutPrint ="LayoutPrint";
		
	
		 /// <summary>
        /// IsUEditor
        /// </summary>
		public string IsUEditor { get; set; } 
		public const string _IsUEditor ="IsUEditor";
		
	
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
		
	
		 /// <summary>
        /// MobileScriptText
        /// </summary>
		public string MobileScriptText { get; set; } 
		public const string _MobileScriptText ="MobileScriptText";
		
	 
	 }
}	 
