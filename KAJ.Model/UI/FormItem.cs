using System;
using System.Collections.Generic;
using System.Text;

namespace KAJ.Model.UI
{
    public class FormItem
    {
        public string ID { get; set; }
        public string Code { get; set; }
        public string TextName { get; set; }
        public string Name { get; set; }
        public string FieldType { get; set; }
        public string ItemType { get; set; }
        public string Enabled { get; set; }
        public string Visible { get; set; }
        public string ReadOnly { get; set; }
        public string Unique { get; set; }
        public string DefaultValue { get; set; }
        public string Group { get; set; }
        public string Settings { get; set; }

        //用于子表汇总列
        public string SummaryType { get; set; }
        public string Width { get; set; }
        public string Align { get; set; }

        //用于子表的格式
        public string ColumnSettings { get; set; }

        public string Help { get; set; }
    }
}