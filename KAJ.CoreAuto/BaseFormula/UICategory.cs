using KAJ.Common.Helper;
using System;
using System.Collections.Generic;
using System.Linq;

namespace KAJ.CoreAuto.BaseFormula
{

    public partial class UICategory
    {
        public string Name
        { get; set; }

        public string Key
        { get; set; }

        bool _multi = true;
        /// <summary>
        /// 
        /// </summary>
        public bool Multi
        {
            get { return _multi; }
            set { _multi = value; }
        }

        string _displayName = "";
        /// <summary>
        /// 
        /// </summary>
        public string DisplayName
        {
            get
            {
                if (String.IsNullOrEmpty(_displayName))
                    return this.Name;
                else
                    return _displayName;
            }
            set { _displayName = value; }
        }

        public string QueryField
        { get; set; }

        QueryMethod _method = QueryMethod.Like;
        /// <summary>
        /// 
        /// </summary>
        public QueryMethod Method
        {
            get
            {
                if (this.Multi) _method = QueryMethod.In;
                return _method;
            }
            set
            {
                _method = value;
            }
        }

        List<CategroyItem> _items;
        public List<CategroyItem> Items
        {
            get
            {
                if (_items == null)
                    _items = new List<CategroyItem>();
                return _items;
            }
        }

        public void SetDefaultItem(string ItemValue = "All")
        {
            //增加自定义列表的标签式查询，标签支持自定义默认值
            System.Text.RegularExpressions.Regex reg = new System.Text.RegularExpressions.Regex("\\{[0-9a-zA-Z_\\.]*\\}");
            string result = reg.Replace(ItemValue, (System.Text.RegularExpressions.Match m) =>
            {
                string value = m.Value.Trim('{', '}');
                switch (value)
                {
                    case "CurrentTime":
                        return DateTime.Now.ToString();
                    case "CurrentDate":
                        return DateTime.Now.Date.ToString("yyyy-MM-dd");
                    case "CurrentYear":
                        return DateTime.Now.Year.ToString();
                    case "CurrentMonth":
                        return DateTime.Now.Month.ToString();
                    case "CurrentQuarter":
                        return ((DateTime.Now.Month + 2) / 3).ToString();
                    default:
                        return "";
                }
            });

            var defaultItem = this.Items.FirstOrDefault(d => d.Value == result);
            if (defaultItem == null) throw new Exception("未能找到Value为【" + result + "】的CategoryItem对象，设置默认值失败");
            foreach (var item in this.Items)
                item.IsDefault = false;
            defaultItem.IsDefault = true;
        }

        public void SetMultiDefaultItem(List<string> ItemValues)
        {
            foreach (var item in this.Items)
                item.IsDefault = false;
            foreach (var ItemValue in ItemValues)
            {
                var defaultItem = this.Items.FirstOrDefault(d => d.Value == ItemValue);
                if (defaultItem == null) throw new Exception("未能找到Value为【" + ItemValue + "】的CategoryItem对象，设置默认值失败");
                else defaultItem.IsDefault = true;
            }
        }
    }

    public partial class CategroyItem
    {
        public string Name
        { get; set; }

        public string Value
        { get; set; }

        public int SortIndex
        { get; set; }

        bool _isDefault = false;
        public bool IsDefault
        {
            get { return _isDefault; }
            set { _isDefault = value; }
        }
    }

    public sealed class CategoryFactory
    {
        static CategoryFactory()
        { }

        public static UICategory GetQuarterCategory(string queryField, bool hasAllAttr = true, string name = "季度", string key = "Quarter")
        {
            var category = new UICategory();
            category.Name = name;
            category.Key = key;
            category.QueryField = queryField;
            if (hasAllAttr)
            {
                var item = new CategroyItem();
                item.Name = "全部";
                item.Value = "All";
                item.IsDefault = true;
                item.SortIndex = 0;
                category.Items.Add(item);
            }
            return category;
        }

        public static UICategory GetMonthCategory(string queryField, bool hasAllAttr = true, string name = "月份", string key = "Month")
        {
            var category = new UICategory();
            category.Name = name;
            category.Key = key;
            category.QueryField = queryField;
            if (hasAllAttr)
            {
                var item = new CategroyItem();
                item.Name = "全部";
                item.Value = "All";
                item.IsDefault = true;
                item.SortIndex = 0;
                category.Items.Add(item);
            }
           
            return category;
        }

        public static UICategory GetYearCategory(string queryField, int before = 5, int after = 1, bool hasAllAttr = true, string name = "年份", string key = "Year")
        {
            var category = new UICategory();
            category.Name = name;
            category.Key = key;
            category.QueryField = queryField;
            if (hasAllAttr)
            {
                var item = new CategroyItem();
                item.Name = "全部";
                item.Value = "All";
                item.IsDefault = true;
                item.SortIndex = 0;
                category.Items.Add(item);
            }
            var date = DateTime.Now;
            for (int i = date.Year - before; i < date.Year + after; i++)
            {
                var item = new CategroyItem();
                item.Name = i.ToString() + "年";
                item.Value = i.ToString();
                item.SortIndex = i + 1;
                category.Items.Add(item);
            }
            return category;
        }

        public static UICategory GetCategoryByString(string enumJson, string name, string queryField, bool hasAllAttr = true)
        {
            var category = new UICategory();
            category.Name = name;

            category.QueryField = queryField;
            if (hasAllAttr)
            {
                var item = new CategroyItem();
                item.Name = "全部";
                item.Value = "All";
                item.SortIndex = 0;
                item.IsDefault = true;
                category.Items.Add(item);
            }
            var list = JsonHelper.ToList(enumJson);

            foreach (var e in list)
            {
                var item = new CategroyItem();
                item.Name = e["text"].ToString();
                item.Value = e["value"].ToString();
                category.Items.Add(item);
            }

            return category;
        }

        public static string GetDefaultQuarter()
        {
            var Quarter = string.Empty;
            for (int i = 1; i < 5; i++)
            {
                Quarter += i + ",";
            }
            return Quarter.TrimEnd(',');
        }

        public static string GetDefaultMonth()
        {
            var Month = string.Empty;
            for (int i = 1; i < 13; i++)
            {
                Month += i + ",";
            }
            return Month.TrimEnd(',');
        }
    }

    public class Tab
    {
        bool _isDisplay = false;
        public bool IsDisplay
        {
            get { return _isDisplay; }
            set { _isDisplay = value; }
        }

        List<UICategory> _categories;
        public List<UICategory> Categories
        {
            get
            {
                if (_categories == null)
                    _categories = new List<UICategory>();
                return _categories;
            }
        }
    }
}
