using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace KAJ.Model.Models
{
	 ///<summary>
	 ///S_UI_Form
	 ///</summary>
	 [Table("S_UI_Form")]	
	 public class S_UI_Form
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
        /// Category
        /// </summary>
		public string Category { get; set; }
	
		 /// <summary>
        /// ConnName
        /// </summary>
		public string ConnName { get; set; }
	
		 /// <summary>
        /// TableName
        /// </summary>
		public string TableName { get; set; }
	
		 /// <summary>
        /// Description
        /// </summary>
		public string Description { get; set; }
	
		 /// <summary>
        /// Script
        /// </summary>
		public string Script { get; set; }
	
		 /// <summary>
        /// ScriptText
        /// </summary>
		public string ScriptText { get; set; }
	
		 /// <summary>
        /// FlowLogic
        /// </summary>
		public string FlowLogic { get; set; }
	
		 /// <summary>
        /// HiddenFields
        /// </summary>
		public string HiddenFields { get; set; }
	
		 /// <summary>
        /// Layout
        /// </summary>
		public string Layout { get; set; }
	
		 /// <summary>
        /// Items
        /// </summary>
		public string Items { get; set; }
	
		 /// <summary>
        /// CalItems
        /// </summary>
		public string CalItems { get; set; }
	
		 /// <summary>
        /// Setttings
        /// </summary>
		public string Setttings { get; set; }
	
		 /// <summary>
        /// SerialNumberSettings
        /// </summary>
		public string SerialNumberSettings { get; set; }
	
		 /// <summary>
        /// DefaultValueSettings
        /// </summary>
		public string DefaultValueSettings { get; set; }
	
		 /// <summary>
        /// CategoryID
        /// </summary>
		public string CategoryID { get; set; }
	
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
        /// ReleaseTime
        /// </summary>
		public DateTime? ReleaseTime { get; set; }
	
		 /// <summary>
        /// ReleasedData
        /// </summary>
		public string ReleasedData { get; set; }
	
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
        /// 冲突状态
        /// </summary>
		public string Collision { get; set; }
	
		 /// <summary>
        /// LayoutEN
        /// </summary>
		public string LayoutEN { get; set; }
	
		 /// <summary>
        /// MobileItems
        /// </summary>
		public string MobileItems { get; set; }
	
		 /// <summary>
        /// IsPrint
        /// </summary>
		public string IsPrint { get; set; }
	
		 /// <summary>
        /// MobileListSql
        /// </summary>
		public string MobileListSql { get; set; }
	
		 /// <summary>
        /// ValidateUnique
        /// </summary>
		public string ValidateUnique { get; set; }
	
		 /// <summary>
        /// VersionEndDate
        /// </summary>
		public DateTime? VersionEndDate { get; set; }
	
		 /// <summary>
        /// VersionNum
        /// </summary>
		public int? VersionNum { get; set; }
	
		 /// <summary>
        /// VersionDesc
        /// </summary>
		public string VersionDesc { get; set; }
	
		 /// <summary>
        /// VersionStartDate
        /// </summary>
		public DateTime? VersionStartDate { get; set; }
	
		 /// <summary>
        /// WebPrintJS
        /// </summary>
		public string WebPrintJS { get; set; }
	
		 /// <summary>
        /// LayoutPrint
        /// </summary>
		public string LayoutPrint { get; set; }
	
		 /// <summary>
        /// IsUEditor
        /// </summary>
		public string IsUEditor { get; set; }
	
		 /// <summary>
        /// CompanyID
        /// </summary>
		public string CompanyID { get; set; }
	
		 /// <summary>
        /// CompanyName
        /// </summary>
		public string CompanyName { get; set; }
	
		 /// <summary>
        /// MobileScriptText
        /// </summary>
		public string MobileScriptText { get; set; }
	 
	 }
}	 
