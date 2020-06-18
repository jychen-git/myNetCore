using KAJ.Common.Helper;
using KAJ.IServices;
using KAJ.Model.Models;
using KAJ.Model.UI;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace KAJ.CoreAuto.BaseFormula
{
    public class UIBuilder//TODO is UIFO
    {
        private readonly SQLHelper sqlHelper = SQLHelper.CreateSqlHelper();

        #region  CreateListHtml  

        public string CreateListHtml(string code)
        {
            string sql = "SELECT  * FROM S_UI_List";
            List<S_UI_List> uiLists = sqlHelper.ExecuteList<S_UI_List>(sql).Where(c => c.Code == code).ToList();
            S_UI_List listDef = uiLists.FirstOrDefault();

            if (listDef == null)
                throw new Exception(string.Format("列表【{0}】不存在", code));
            var fields = JsonHelper.ToList(listDef.LayoutField);
            var buttons = JsonHelper.ToList(listDef.LayoutButton);
            var showQueryForm = false; var rowCount = 2;
            var isColumnEdit = false;
            var showPager = true;
            bool showFilterRow = false;
            if (!string.IsNullOrEmpty(listDef.LayoutGrid))
            {
                Dictionary<string, object> settings = JsonHelper.ToObject(listDef.LayoutGrid);
                if (settings.GetValue("allowCellEdit") == "true")
                    isColumnEdit = true;
                if (settings.GetValue("showPager") == "false")
                    showPager = false;
                if (!isColumnEdit && settings.GetValue("showFilterRow") == "true")
                    showFilterRow = true;
            }
            if (!String.IsNullOrEmpty(listDef.Settings))
            {
                var settings = JsonHelper.ToObject(listDef.Settings);
                if (settings.GetValue("ShowQueryForm") == "T")
                {
                    showQueryForm = true;
                    if (!String.IsNullOrEmpty(settings.GetValue("QueryFormColmuns")))
                    {
                        rowCount = Convert.ToInt32(settings.GetValue("QueryFormColmuns"));
                    }
                }
            }
            //详细查询字段
            var queryFields = fields.Where(c => c.ContainsKey("ItemType") && c["ItemType"].ToString() != "");
            //快速查询字段
            var quickQueryFields = fields.Where(c => c.ContainsKey("AllowSearch") && c["AllowSearch"].ToString() == "true");

            if (isColumnEdit && !showPager)
            {
                //不能详查
                queryFields = new List<Dictionary<string, object>>();
                showQueryForm = false;
            }
            #region QueryForm

            StringBuilder sbQuery = new StringBuilder();

            int i = 0; var queryFieldsCount = queryFields.Count();
            foreach (var item in queryFields)
            {
                if (i % rowCount == 0)
                    sbQuery.Append("<tr>");

                if (i + 1 % rowCount == 0)
                    sbQuery.Append("<td width=\"5%\" /></tr>");
                else
                {
                    sbQuery.Append(GetQueryItemUI(listDef, item, showQueryForm));
                    if ((i + 1) % rowCount == 0)
                        sbQuery.Append("</tr>");
                    else if (i == queryFieldsCount - 1)
                        sbQuery.Append("</tr>");
                }
                i++;
            }
            var queryHtml = string.Empty; string strQueryForm = string.Empty;
            if (showQueryForm)
            {
                queryHtml = @"
    <div class='queryDiv'>
        <form id='queryForm' method='post'>
        <table>
           {0}
        </table>
        </form>
    </div>";
                strQueryForm = string.Format(queryHtml, sbQuery);
            }
            else
            {
                queryHtml = @"
<div id='queryWindow' class='mini-window' title='详细查询' style='width: 690px; height: @{1}px;'>
    <div class='queryDiv'>
        <form id='queryForm' method='post'>
        <table>
           {0}
        </table>
        </form>
        <div>
            <a class='mini-button' onclick='search()' iconcls='icon-find' style='margin-right: 20px;'>查询</a>
            <a class='mini-button' onclick='clearQueryForm()' iconcls='icon-undo'>清空</a>
        </div>
    </div>
</div>";
                strQueryForm = string.Format(queryHtml, sbQuery, 100 + 22 * (queryFields.Count() / 2));
            }
            #endregion

            #region Bar条

            StringBuilder sbButtons = new StringBuilder();
            bool isRightKey = false;
            foreach (var item in buttons)
            {
                string onclick = "";
                if (item.ContainsKey("URL") && !string.IsNullOrEmpty(item["URL"].ToString()))
                {
                    onclick = "onclick='openWindow(\"" + item["URL"] + "\"";
                    if (item.ContainsKey("Settings"))
                    {
                        var sets = JsonHelper.ToObject(item["Settings"].ToString());
                        if (sets.ContainsKey("Field") && !string.IsNullOrEmpty(sets["Field"].ToString()))
                            continue;
                        Dictionary<string, object> dic = new Dictionary<string, object>();
                        if (sets.ContainsKey("PopupWidth") && sets["PopupWidth"].ToString() != "")
                            dic.Add("width", sets["PopupWidth"].ToString());
                        else
                            dic.Add("width", "1000");
                        if (sets.ContainsKey("PopupHeight") && sets["PopupHeight"].ToString() != "")
                            dic.Add("height", sets["PopupHeight"].ToString());
                        if (sets.ContainsKey("PopupTitle") && sets["PopupTitle"].ToString() != "")
                            dic.Add("title", sets["PopupTitle"].ToString());
                        if (sets.ContainsKey("Confirm") && sets["Confirm"].ToString() == "true")
                            dic.Add("mustConfirm", "true");
                        if (sets.ContainsKey("SelectMode") && sets["SelectMode"].ToString() != "")
                            dic.Add(sets["SelectMode"].ToString(), "true");
                        onclick += "," + JsonHelper.ToJson(dic);

                        if (sets.ContainsKey("onclick") && !string.IsNullOrWhiteSpace(sets["onclick"].ToString())) //如果有自定义的按钮onclick
                            onclick = "";
                    }
                    else
                    {
                        onclick += ",{width:1000}";
                    }

                    if (onclick != "")
                        onclick += ");'";
                }
                if (item.ContainsKey("Settings"))
                {
                    var sets = JsonHelper.ToObject(item["Settings"].ToString());
                    var buttonType = sets.GetValue("ButtonType");
                    if (!string.IsNullOrEmpty(buttonType) && buttonType == "rightKey" && item.GetValue("Enabled") == "true")
                    {
                        isRightKey = true;
                    }
                }
                sbButtons.AppendFormat("\n<a class='mini-button' {0} {1} {2}></a>"
                    , GetMiniuiSettings(item)
                    , onclick
                    , item.ContainsKey("Settings") ? GetMiniuiSettings(item["Settings"].ToString()) : "");
            }

            StringBuilder sb = new StringBuilder();
            string strBar = "";
            if (showQueryForm)
            {
                strBar = @"
<div class='mini-toolbar gw-grid-toolbar' style='padding: 0px 0px 0px 0px;'>
    <table>
        <tr>
            <td>
                {0}
            </td>
            <td class='gw-toolbar-right'>
            <a class='mini-button' onclick='search()' iconcls='icon-find'>查询</a>
            <a class='mini-button' onclick='clearQueryForm()' iconcls='icon-undo'>清空</a>
            </td>
        </tr>
    </table>
</div>";
                strBar = string.Format(strBar
                       , sbButtons
                       );
            }
            else
            {//TODO gw清掉
                strBar = @"
<div class='mini-toolbar gw-grid-toolbar' style='padding: 0px 0px 0px 0px;'>
    <table>
        <tr>
            <td>
                {0}
            </td>
            <td class='gw-toolbar-right'>
            {1}
            {3}
            {2}
            </td>
        </tr>
    </table>
</div>";

                string emptyText = string.Join("或", quickQueryFields.Select(c => c["header"].ToString()).ToArray());
                string strQuickQueryBox = string.Format("<input id='key' class='mini-buttonedit gw-searchbox' style='width:{3}em;' emptytext='请输入{0}' onenter=\"{2}('{1}');\" onbuttonclick=\"{2}('{1}');\" />"
                    , emptyText
                    , string.Join(",", quickQueryFields.Select(c => c["field"].ToString()).ToArray())
                    , isColumnEdit && !showPager ? "clientSearch" : "quickSearch"
                    , emptyText.Length + 5 >= 15 ? emptyText.Length + 5 : 15
                    );

                string strFilterButton = "<a id='list-filter-btn' class='mini-button' onclick=\"filterSwitch();\" iconcls='icon-filter'>筛选</a>";

                string strSearchButton = "<a class='mini-button' onclick=\"showWindow('queryWindow');\" iconcls='icon-find'>详细</a>";

                strBar = string.Format(strBar
                    , sbButtons
                    , quickQueryFields.Count() > 0 ? strQuickQueryBox : ""
                    , queryFields.Count() > 0 ? strSearchButton : ""
                    , showFilterRow ? strFilterButton : ""
                    );
            }

            #endregion

            #region 默认值
            //默认值Dic
            var defaultDic = new Dictionary<string, string>();
            if (isColumnEdit)
            {
                foreach (var item in fields)
                {
                    var _DefaultValue = item.GetValue("Edit_DefaultValue");
                    var _Code = item.GetValue("field");
                    var _ItemType = item.GetValue("Edit_ItemType");
                    if (string.IsNullOrEmpty(_DefaultValue))
                        continue;
                    if (_DefaultValue.Contains(',') && _ItemType == "ButtonEdit")
                    {
                        defaultDic.Add(_Code, GetDefaultValue(_Code, _DefaultValue.Split(',').First(), GetDefaultValueDic(listDef.DefaultValueSettings)));
                        defaultDic.Add(_Code + "Name", GetDefaultValue(_Code, _DefaultValue.Split(',').Last(), GetDefaultValueDic(listDef.DefaultValueSettings)));
                    }
                    else
                    {
                        defaultDic.Add(_Code, GetDefaultValue(_Code, _DefaultValue, GetDefaultValueDic(listDef.DefaultValueSettings)));
                    }
                }
                sb.AppendLine();
                sb.AppendFormat("\n var defaultValueDic = {0}", JsonHelper.ToJson(defaultDic));
            }
            #endregion

            #region Grid

            string strField = "";
            StringBuilder sbField = new StringBuilder();
            bool multi = false;
            foreach (var field in fields)
            {
                string header = field["header"].ToString();
                if (header.Contains("."))
                {
                    multi = true;
                    break;
                }
                if (isColumnEdit)
                    sbField.Append(CreateListEditColumnItem(field, listDef));
                else
                    sbField.AppendFormat("<div name='{3}' {0} {1} header='{2}'>{4}</div>", GetMiniuiSettings(field)
                        , field.ContainsKey("Settings") ? GetMiniuiSettings(field["Settings"].ToString()) : ""
                        , header, field["field"].ToString()
                        , showFilterRow ? GetFilterInputHtml(field) : "");
            }
            if (multi)
            {
                fields.RemoveWhere(c => c["Visible"].ToString() == "false");
                if (isColumnEdit)
                    strField = CreateListEditColumn("", fields, listDef);
                else
                    strField = CreateListColumn("", fields, showFilterRow);
            }
            else
            {
                strField = sbField.ToString();
            }


            string strTreeGridPager = @"
<div class='mini-pager' 
    id='treeGridPager' onpagechanged='onPageChanged' sizeList='[10,20,50,100,200,300,500]' pagesize='50' showPageSize='true' showPageIndex='true' showPageInfo='true' >        
</div> 
<script>

    function onTreeGridLoad(e) {
        if (e.text) {
            var resultData = mini.decode(e.text);
            e.result = resultData;
            if (e.result && e.result.data) {
                e.sender.loadList(e.result.data);
                var pager = mini.get('#treeGridPager');
                if (pager) {
                    pager.setTotalCount(e.result.total);
                }
            }  
        }
    }
    $('#dataGrid').attr('onbeforeload', 'onBeforeTreeLoad');
    function onBeforeTreeLoad(e) {
        var tree = e.sender;    //树控件
        var node = e.node;      //当前节点
        var params = e.params;  //参数对象

        //可以传递自定义的属性
        if (node._id != '-1') {
            params.NodeInfo = mini.encode(node);
            params.IsLoadChildren = 'true';
        }
        else {
            params.IsLoadChildren = 'false';
            params.NodeInfo = mini.encode({});
        }
    }

    function onPageChanged(e) {
        var pageIndex = e.pageIndex;
        var pageSize = e.pageSize;
        $('.mini-treegrid').each(function () {
            var grid = mini.get('#' + $(this).attr('id'));
            if (grid.url) {
                grid.setPageIndex(pageIndex);
                grid.setPageSize(pageSize);
                grid.reload();
            }
        });
    }
</script>";

            string strTreeGridScript = @"
<script>
    function onTreeGridLoad(e) {
        if (e.text) {
            var resultData = mini.decode(e.text);
            e.result = resultData;
            if (e.result && e.result.data) {
                e.sender.loadList(e.result.data);
                var pager = mini.get('#treeGridPager');
                if (pager) {
                    pager.setTotalCount(e.result.total);
                }
            }              
        }
    }
</script>";

            string strGrid = @"
<div class='mini-fit' id='divGrid'>
    <div id='dataGrid' class='{4}' style='width: 100%; height: 100%;' url='GetList' {0} {5} {7}  onDrawSummaryCell='onDrawSummaryCell'>
        <div property='columns'>         
            {2}  
            {3}
            {1}
        </div>
    </div>
</div>
{6}
";
            bool isTreeGrid = IsTreeGrid(listDef.LayoutGrid);

            strGrid = string.Format(strGrid
                , GetMiniuiSettings(listDef.LayoutGrid, isTreeGrid) + (isColumnEdit && showPager ? " onbeforeload='onDataGridBeforeload' " : isColumnEdit ? " sortMode='client' " : "") + GetTreeGridSettings(listDef.LayoutGrid, fields, isTreeGrid)
                , strField //sbField
                , listDef.HasRowNumber == "1" ? "<div type='indexcolumn' headerAlign='center'>序号</div>" : ""
                , listDef.HasCheckboxColumn != "0" ? "<div type='checkcolumn'></div>" : ""
                , isTreeGrid ? "mini-treegrid" : "mini-datagrid"
                , isRightKey ? "contextmenu='#treeMenu'" : ""
                , isTreeGrid && showPager ? strTreeGridPager : strTreeGridScript
                 , "ajaxOptions={async:true}"
                );

            #endregion

            if (showQueryForm)
            {
                return strBar + "\n" + strQueryForm + "\n" + strGrid + "\n" + createExportExcelbtn(code);
            }
            else
            {
                return strBar + "\n" + strGrid + "\n" + strQueryForm + "\n" + createExportExcelbtn(code);
            }
        }


        private string GetQueryItemUI(S_UI_List listDef, Dictionary<string, object> field, bool showQueryForm = false)
        {
            string mode = field.ContainsKey("QueryMode") ? field["QueryMode"].ToString() : "";
            string queryMode = getQueryMode(mode);

            string code = field["field"].ToString();
            string name = field["header"].ToString();
            string miniCls = field["ItemType"].ToString().ToLower();
            string dataPty = "";
            var isColumnEdit = false; var showPager = true;
            if (!string.IsNullOrEmpty(listDef.LayoutGrid))
            {
                var settings = JsonHelper.ToObject(listDef.LayoutGrid);
                if (settings.GetValue("allowCellEdit") == "true")
                    isColumnEdit = true;
                if (settings.GetValue("showPager") == "false")
                    showPager = false;
            }
            if (!isColumnEdit)
            {
                if (field.ContainsKey("Settings"))
                {
                    var settings = JsonHelper.ToObject(field["Settings"].ToString());
                    if (settings.ContainsKey("EnumKey"))
                    {
                        dataPty = string.Format(" data='{0}' ", GetEnumKey(listDef.TableNames.Split(',')[0], code, settings["EnumKey"].ToString()));
                    }
                }
            }
            else
            {
                if (field.ContainsKey("Edit_Settings"))
                {
                    var settings = JsonHelper.ToObject(field["Edit_Settings"].ToString());
                    if (settings.ContainsKey("data"))
                    {
                        dataPty = string.Format(" data='{0}' ", GetEnumKey(listDef.TableNames.Split(',')[0], code, settings["data"].ToString()));
                    }
                }
            }

            string html = "";

            string miniuiSettings = GetMiniuiSettings(field.ContainsKey("QuerySettings") ? field["QuerySettings"].ToString() : "{}");

            html = string.Format("<input name=\"${0}${1}\" class=\"mini-{2}\" {3} {4} style='width:100%' />"
   , queryMode, code, miniCls, miniuiSettings, dataPty);


            if (field["QueryMode"].ToString() == "Between")
            {
                html = string.Format("<input name=\"${0}${1}\" class=\"mini-{2}\" {4} style='width:45%'/>&nbsp;-&nbsp;<input name=\"${3}${1}\" class=\"mini-{2}\" {4} style='width:45%'/>"
                  , "FR", code, miniCls, "TO", miniuiSettings);
            }

            if (showQueryForm)
            {
                return string.Format("<td >{0}</td><td  nowrap=\"nowrap\" style=\"padding-right:40px;\">{1}</td>", name, html);
            }
            else
            {
                return string.Format("<td width=\"15%\">{0}</td><td width=\"35%\" nowrap=\"nowrap\">{1}</td>", name, html);
            }
        }

        private string getQueryMode(string mode)
        {
            string queryMode = "";
            switch (mode)
            {
                case "Equal":
                    queryMode = "EQ";
                    break;
                case "NotEqual":
                    queryMode = "UQ";
                    break;
                case "GreaterThan":
                    queryMode = "GT";
                    break;
                case "LessThan":
                    queryMode = "LT";
                    break;
                case "In":
                    queryMode = "IN";
                    break;
                case "GreaterThanOrEqual":
                    queryMode = "FR";
                    break;
                case "LessThanOrEqual":
                    queryMode = "TO";
                    break;
                case "Like":
                    queryMode = "LK";
                    break;
                case "InLike":
                    queryMode = "IL";
                    break;
                case "StartsWith":
                    queryMode = "SW";
                    break;
                case "EndsWith":
                    queryMode = "EW";
                    break;
                case "IGNORE":
                    queryMode = "";
                    break;
                default:
                    queryMode = "LK";
                    break;
            }
            return queryMode;
        }

        //
        private string GetEnumKey(string tableName, string fieldCode, string data)
        {
            bool fromMeta = false;
            if (data.StartsWith("[") == false)
            {
                var arr = data.Split(',');
                if (arr.Length == 3)
                {
                    tableName = arr[1];
                    fieldCode = arr[2];
                    fromMeta = true;
                }
                else if (arr.Length == 2)
                {
                    tableName = arr[0];
                    fieldCode = arr[1];
                    fromMeta = true;
                }
            }

            string result = "";
            if (data.StartsWith("["))
                result = string.Format("enum_{0}_{1}", tableName, fieldCode);
            else if (data == "" || data == "FromMeta" || fromMeta == true)
            {
                result = string.Format("enum_{0}_{1}", tableName, fieldCode);
            }
            else
            {
                result = data.Split('.').Last();
            }

            return result;
        }
        //


        public string GetMiniuiSettings(string settings, bool isTreeGrid = false)
        {
            if (string.IsNullOrEmpty(settings))
                return "";
            var dic = JsonHelper.ToObject(settings);
            return GetMiniuiSettings(dic, isTreeGrid);
        }

        public string GetMiniuiSettings(Dictionary<string, object> dic, bool isTreeGrid = false)
        {
            if (dic.Count == 0)
                return "";

            StringBuilder sb = new StringBuilder();
            string style = "";
            foreach (string key in dic.Keys)
            {
                if (key != "Enabled" && key != "Visible" && key.StartsWith(key.Substring(0, 1).ToUpper())) //以大写字符开头的不处理
                    continue;
                if (key == "Settings" && dic["Settings"] != null && !string.IsNullOrEmpty(dic["Settings"].ToString())) //如果checkbox，存在setting，则需要根据setting设置相关属性
                {
                    var setting = JsonHelper.ToObject(dic["Settings"].ToString());
                    if (setting.Keys.Contains("trueValue") && setting["trueValue"] != null && !string.IsNullOrEmpty(setting["trueValue"].ToString()))
                        sb.AppendFormat(" truevalue='{0}'", setting["trueValue"].ToString());
                    if (setting.Keys.Contains("falseValue") && setting["falseValue"] != null && !string.IsNullOrEmpty(setting["falseValue"].ToString()))
                        sb.AppendFormat(" falsevalue='{0}'", setting["falseValue"].ToString());
                }
                else if (key == "showFilterRow" && dic[key].ToString().ToLower() == "true")
                {
                    sb.Append(" showFilterRow=false");//筛选默认关闭
                }
                else if (key == "format" && !String.IsNullOrEmpty(dic.GetValue("decimalPlaces")))
                {
                    //数字控件，设置格式的时候默认是保留2位小数，如果设置了小数位，则格式设置需要拼接小数位
                    sb.Append(String.Format(" format='{0}'", dic.GetValue("format") + dic.GetValue("decimalPlaces")));
                }
                else if (dic[key] != null && dic[key].ToString() != "")
                {
                    if (key == "readonly")
                    {
                        if (dic[key].ToString() == "true")
                            sb.AppendFormat(" {0}='{1}'", key, dic[key]);
                    }
                    else if (key.ToLower() == "showpager")
                    {
                        if (!isTreeGrid)
                            sb.AppendFormat(" {0}='{1}'", key, dic[key]);
                    }
                    else
                    {
                        if (key.StartsWith("style_"))
                            style += string.Format("{0}:{1};", key.Split('_')[1], dic[key]);
                        else
                            sb.AppendFormat(" {0}='{1}'", key.ToLower(), dic[key]);
                    }
                }
            }

            string result = sb.ToString();
            if (!string.IsNullOrEmpty(style))
                result += " style='" + style + "'";
            return result;
        }
        //
        public string GetDefaultValue(string code, string defaultValueTmpl, Dictionary<string, DataTable> dtDic)
        {
            if (string.IsNullOrEmpty(defaultValueTmpl))
                return "";

            string result = "";
            if (dtDic.Count == 0)
            {
                result = ReplaceString(defaultValueTmpl, null);
            }
            else
            {
                result = ReplaceString(defaultValueTmpl, null, null, dtDic);  //新的配置方式为默认数据表名.字段名

                if (result.Contains('{') == true)//替换完成后，发现仍然有大括号，说明使用的配置方式为：字段名，需要遍历默认值表
                {
                    foreach (var dt in dtDic.Values)
                    {
                        if (dt.Rows.Count > 0)
                            result = ReplaceString(result, dt.Rows[0]);
                        if (result.Contains('{') == false)  //没有大括号，说明已经替换完毕
                            break;
                    }
                }
            }


            return result;
        }
        //
        /// <summary>
        /// 初始化默认值
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="row"></param>
        /// <param name="dic"></param>
        /// <param name="dtDic"></param>
        /// <param name="validateCurrentUser"></param>
        /// <returns></returns>
        public string ReplaceString(string sql, DataRow row = null, Dictionary<string, string> dic = null,
          Dictionary<string, DataTable> dtDic = null, bool validateCurrentUser = true)
        {
            if (string.IsNullOrEmpty(sql))
                return sql;
            //确认返回的用户
            //  var user = validateCurrentUser ? FormulaHelper.GetUserInfo() : new UserInfo();
            Regex reg = new Regex("\\{[0-9a-zA-Z_\\.]*\\}");
            string result = reg.Replace(sql, (Match m) =>
            {
                string value = m.Value.Trim('{', '}');

                if (dtDic != null && dtDic.Count > 0)
                {
                    var arr = value.Split('.');
                    if (arr.Length == 1)
                    {
                        if (dtDic.ContainsKey(value)) //默认值为整个表
                            return JsonHelper.ToJson(dtDic[value]);
                    }
                    else if (arr.Length == 2) //默认子编号名.字段名
                    {
                        if (dtDic.ContainsKey(arr[0]))
                        {
                            var dt = dtDic[arr[0]];
                            if (dt.Rows.Count > 0 && dt.Columns.Contains(arr[1]))
                            {
                                return dt.Rows[0][arr[1]].ToString();
                            }
                        }
                    }

                }
                if (row != null && row.Table.Columns.Contains(value))
                    return row[value].ToString();
                if (dic != null && dic.ContainsKey(value))
                    return dic[value];

                //TODO 请确认此返回值
                //if (!string.IsNullOrEmpty(HttpContext.Current.Request[value]))
                //    return HttpContext.Current.Request[value];

                switch (value)
                {
                    //case Formula.Constant.CurrentUserID:
                    //    return user.UserID;
                    //case Formula.Constant.CurrentUserName:
                    //    return user.UserName;
                    //case Formula.Constant.CurrentUserOrgID:
                    //    return user.UserOrgID;
                    //case Formula.Constant.CurrentUserOrgCode:
                    //    return user.UserOrgCode;
                    //case Formula.Constant.CurrentUserOrgName:
                    //    return user.UserOrgName;
                    //case Formula.Constant.CurrentUserPrjID:
                    //    return user.UserPrjID;
                    //case Formula.Constant.CurrentUserDeptIDs:
                    //    return user.UserDeptIDs;
                    //case Formula.Constant.CurrentUserOrgIDs:
                    //    return user.UserOrgIDs;
                    //case Formula.Constant.CurrentUserPrjName:
                    //    return user.UserPrjName;
                    //case "CurrentUserOrgFullName":
                    //    return user.UserFullOrgName;
                    //case "CurrentUserCorpID":
                    //    return user.UserCompanyID;
                    //case "CurrentUserCorpName":
                    //    return user.UserCompanyName;
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

            return result;
        }
        //
        public Dictionary<string, DataTable> GetDefaultValueDic(string DefaultValueSettings, DataRow row = null, bool validateCurrentUser = true)
        {
            try
            {
                if (string.IsNullOrEmpty(DefaultValueSettings))
                    return new Dictionary<string, DataTable>();

                Dictionary<string, DataTable> defaultValueDic = new Dictionary<string, DataTable>();
                foreach (var item in JsonHelper.ToList(DefaultValueSettings))
                {
                    if (item.GetValue("treeGridSource") == true.ToString().ToLower())
                        continue;
                    SQLHelper tmpSQLHelper = SQLHelper.CreateSqlHelper(item["ConnName"].ToString());
                    string defaultSQL = ReplaceString(item["SQL"].ToString(), row, null, null, validateCurrentUser);
                    DataTable tmpDT = tmpSQLHelper.ExecuteDataTable(defaultSQL);

                    string code = Guid.NewGuid().ToString();
                    if (item.ContainsKey("Code") && item["Code"].ToString().Trim() != "")
                        code = item["Code"].ToString().Trim();
                    defaultValueDic.Add(code, tmpDT);
                }

                return defaultValueDic;
            }

            catch (Exception ex)
            {
                throw new Exception(ex.Message + ";默认值Sql执行失败！");
            }
        }
        //
        private string CreateListEditColumnItem(Dictionary<string, object> field, S_UI_List listDef)
        {
            StringBuilder sb = new StringBuilder();
            if (field.GetValue("Visible") == "false")
                return "";
            var _ItemType = field.GetValue("Edit_ItemType");
            var _Code = field.GetValue("field");
            var _Name = field.GetValue("header");
            var _Edit_Settings = field.GetValue("Edit_Settings");
            var miniuiSettings = GetMiniuiSettings(_Edit_Settings);
            var _GridId = "dataGrid";

            #region 特殊控件处理

            if (_ItemType == "CheckBox")
            {
                sb.AppendFormat("\n<div type='checkboxcolumn' name='{0}' {1} {2} {3}></div>"
                    , _Code
                    , ""
                    , GetMiniuiSettings(field)
                    , miniuiSettings
                    );
                return sb.ToString();
            }
            else if (_ItemType == "SingleFile")
            {

                sb.AppendFormat(@"
<div field='{0}' name='{0}' displayfield='{0}Name' {1} {2} renderer='onFileRender'>
    <input property='editor' class='mini-fileupload' onclick='btnUploadifiveClick' style='width: 100%;' label='{3}' />  
</div>"

                   , _Code
                   , ""
                   , GetMiniuiSettings(field)
                   , _Edit_Settings
                   );

                return sb.ToString();
            }

            #endregion

            if (miniuiSettings == "")
                miniuiSettings = "style='width:100%'";

            string ColumnSettings = GetMiniuiSettings(field.GetValue("Edit_ColumnSettings"));//列格式

            string dataPty = "";
            if (_ItemType == "ComboBox")
            {
                string tableName = listDef.TableNames.Split(',')[0] + "_" + _GridId;
                dataPty = GetFormItemDataPty(tableName, _Code, _Edit_Settings);
            }

            #region 获取vtype
            string vtype = "";
            if (!string.IsNullOrEmpty(_Edit_Settings))
            {
                var _dic = JsonHelper.ToObject<Dictionary<string, string>>(_Edit_Settings);
                if (_dic.ContainsKey("required") && _dic["required"] == "true")
                    vtype += "required;";
                if (_dic.ContainsKey("vtype"))
                    vtype += _dic["vtype"];
            }
            #endregion

            string comboBoxPty = "type='comboboxcolumn'";
            if (_ItemType == "ComboBox")
            {
                var columSettingsDic = JsonHelper.ToObject(_Edit_Settings);
                if (columSettingsDic.ContainsKey("textName") && columSettingsDic["textName"].ToString() != "")
                    comboBoxPty = string.Format("displayField='{0}'", columSettingsDic["textName"]);
            }

            string itemHtml = string.Format(@"
                <div name='{3}'  {8} {4} {5} {6} {7} {0} autoShowPopup='true' {12} {13}>
                        <input {9} property='editor' class='mini-{1}' {2} {10} {11} {14} />
                </div>
                ", GetMiniuiSettings(field)
                , _ItemType.ToLower()
                , miniuiSettings
                , _Code
                , ""
                , _ItemType == "DatePicker" && ColumnSettings.IndexOf("dateformat") >= 0 ? "dateFormat='yyyy-MM-dd'" : ""
                , _ItemType == "ComboBox" ? comboBoxPty : ""
                , vtype == "" ? "" : string.Format("vtype='{0}'", vtype)
                , _ItemType == "ButtonEdit" ? "displayfield='" + _Code + "Name'" : ""
                , _ItemType == "ButtonEdit" ? " name='" + _GridId + "_" + _Code + "'" : ""  //列表上选择暂时不支持智能感知，因此先加allowInput
                , _ItemType == "ComboBox" && miniuiSettings.Contains("multiselect='true'") == false && miniuiSettings.Contains("onitemclick=") == false ? "onitemclick=\"commitGridEdit('" + _GridId + "');\"" : ""
                , _ItemType == "DatePicker" ? "onhidepopup=\"commitGridEdit('" + _GridId + "');\"" : ""
                , string.IsNullOrEmpty(field.GetValue("SummaryType")) ? "" : string.Format("summaryType='{0}' summaryRenderer='onSummaryRenderer'", field.GetValue("SummaryType"))
                , ColumnSettings
                , dataPty
                );
            sb.Append(itemHtml);



            return sb.ToString();

        }
        //
        private string GetFormItemDataPty(string tableName, string fieldCode, string settings)
        {
            if (string.IsNullOrEmpty(settings))
                return "";

            var dic = JsonHelper.ToObject<Dictionary<string, string>>(settings);
            string data = "";
            if (dic.ContainsKey("data"))
                data = dic["data"];
            return string.Format(" data='{0}'", GetEnumKey(tableName, fieldCode, data));
        }
        //
        private string GetFilterInputHtml(Dictionary<string, object> field)
        {
            string _fieldName = field.ContainsKey("field") ? field["field"].ToString() : "";
            string _queryType = field.ContainsKey("QueryMode") ? field["QueryMode"].ToString() : "";
            string _dataType = "S";
            if (field.ContainsKey("Settings"))
            {
                var _settings = JsonHelper.ToObject(field["Settings"].ToString());
                //枚举
                if (_settings.ContainsKey("EnumKey") && !string.IsNullOrWhiteSpace(_settings["EnumKey"].ToString()))
                {
                    string _key = _settings["EnumKey"].ToString();
                    _key = GetEnumKey("", field["field"].ToString(), _key);
                    if (!string.IsNullOrWhiteSpace(_key))
                        return string.Format("<input id='{0}' property='filter' class='mini-filteredit' filterData='{2}.concat(headerDefault)' style='width:100%;' showClose='true' onvaluechanged='gridFilter(this,\"equal\",\"{1}\",{2});' />", _fieldName, _dataType, _key);
                }
                //数值/日期/枚举
                if (_settings.ContainsKey("dataType") && !string.IsNullOrWhiteSpace(_settings["dataType"].ToString()))
                {
                    string _type = _settings["dataType"].ToString().ToLower();
                    if (_type == "int" || _type == "float" || _type == "currency")
                        _dataType = "N";
                    else if (_type == "date")
                        _dataType = "D";
                    else if (_type == "boolean")
                        _dataType = "B";
                }
            }
            switch (_dataType)
            {
                case "N":
                case "D":
                    return string.Format("<input id='{0}' property='filter' class='mini-filteredit' filterData='headerFilters' style='width:100%;' showClose='true' onvaluechanged='gridFilter(this,\"between\",\"{1}\");' />", _fieldName, _dataType);
                case "B":
                    return string.Format("<input id='{0}' property='filter' class='mini-filteredit' filterData='headerDefault' style='width:100%;' showClose='true' onvaluechanged='gridFilter(this,\"equal\",\"{1}\");' />", _fieldName, _dataType);
                default:
                    return string.Format("<input id='{0}' property='filter' class='mini-filteredit' filterData='headerDefault' style='width:100%;' showClose='true' onvaluechanged='gridFilter(this,\"like\",\"{1}\");' />", _fieldName, _dataType);
            }
        }

        //
        private string CreateListEditColumn(string fieldName, List<Dictionary<string, object>> fields, S_UI_List listDef)
        {
            if (fields.Count == 0)
                return "";

            if (fields.Count == 1)
            {
                var field = fields[0];
                return CreateListEditColumnItem(field, listDef);
            }

            StringBuilder sb = new StringBuilder();
            if (!string.IsNullOrEmpty(fieldName))
                sb.AppendFormat("<div header='{0}' headerAlign='center'><div property='columns'>", fieldName);
            sb.AppendLine();
            while (fields.Count > 0)
            {
                var field = fields[0];
                string name = field["header"].ToString().Split('.').First();
                var newFields = fields.Where(c => c["header"].ToString().StartsWith(name + ".") || c["header"].ToString() == name).ToList();
                fields.RemoveWhere(c => c["header"].ToString().StartsWith(name + ".") || c["header"].ToString() == name);

                foreach (var item in newFields)
                {
                    item["header"] = item["header"].ToString().Replace(name + ".", "");
                }
                sb.AppendLine();
                string str = CreateListEditColumn(name, newFields, listDef);
                sb.AppendFormat(str);
            }
            sb.AppendLine();
            if (!string.IsNullOrEmpty(fieldName))
                sb.AppendFormat("</div></div>");
            return sb.ToString();
        }

        //
        private string CreateListColumn(string fieldName, List<Dictionary<string, object>> fields, bool showFilterRow = false)
        {
            if (fields.Count == 0)
                return "";

            if (fields.Count == 1)
            {
                var field = fields[0];
                return string.Format("<div name='{3}' field='{2}' {0} {1}>{4}</div>"
                     , GetMiniuiSettings(field)
                     , field.ContainsKey("Settings") ? GetMiniuiSettings(field["Settings"].ToString()) : ""
                     , field["field"]
                     , field["field"]
                     , showFilterRow ? GetFilterInputHtml(field) : "" //过滤行
                     );
            }


            StringBuilder sb = new StringBuilder();
            if (!string.IsNullOrEmpty(fieldName))
                sb.AppendFormat("<div header='{0}' headerAlign='center'><div property='columns'>", fieldName);
            sb.AppendLine();
            while (fields.Count > 0)
            {
                var field = fields[0];
                string name = field["header"].ToString().Split('.').First();
                var newFields = fields.Where(c => c["header"].ToString().StartsWith(name + ".") || c["header"].ToString() == name).ToList();
                fields.RemoveWhere(c => c["header"].ToString().StartsWith(name + ".") || c["header"].ToString() == name);

                foreach (var item in newFields)
                {
                    item["header"] = item["header"].ToString().Replace(name + ".", "");
                }
                sb.AppendLine();
                string str = CreateListColumn(name, newFields, showFilterRow);
                sb.AppendFormat(str);
            }
            sb.AppendLine();
            if (!string.IsNullOrEmpty(fieldName))
                sb.AppendFormat("</div></div>");
            return sb.ToString();
        }
        //
        public bool IsTreeGrid(string settings)
        {
            if (string.IsNullOrEmpty(settings))
                return false;
            var dic = JsonHelper.ToObject(settings);
            if (dic.GetValue("isTreeGrid") == "true")
                return true;
            else
                return false;
        }

        //
        private string createExportExcelbtn(string code)
        {
            StringBuilder sb = new StringBuilder();

            string includeColumns = "";
            string excelKey = "";
            string gridId = "dataGrid";

            includeColumns = !string.IsNullOrWhiteSpace(includeColumns) && !includeColumns.EndsWith(",") ? includeColumns + "," : includeColumns;
            excelKey = code;

            var strFormHTML = @"    
    <!--导出Excel——模拟异步ajax提交表单 -->
    <form id='excelForm{0}' style='display:none;' action='/MvcConfig/Aspose/ExportExcel' method='post' target='excelIFrame{0}'>
        <input type='hidden' name='jsonColumns' />
        <input type='hidden' name='title' />
        <input type='hidden' name='excelKey' />
        <input type='hidden' name='queryFormData' />
        <input type='hidden' name='quickQueryFormData' />
        <input type='hidden' name='queryTabData' />
        <input type='hidden' name='sortOrder' />
        <input type='hidden' name='sortField' />
        <input type='hidden' name='pageSize' />
        <input type='hidden' name='pageIndex' />
        <input type='hidden' name='exportCurrentPage' />
        <input type='hidden' name='dataUrl' />
        <input type='hidden' name='referUrl' />
    </form>
    <iframe id='excelIFrame{0}' name='excelIFrame{0}' style='display:none;'></iframe>";

            sb.AppendLine(string.Format(strFormHTML, excelKey));

            var strExcelWindowHTML = @"
<!--导出Excel——自定义删选字段-->
<div id='excelWindow{2}' class='mini-window' title='导出数据' style='width: 262px; height: 280px; display:none;'
    showmodal='true' allowresize='false' allowdrag='true'>
    <div id='gridColumns{2}' class='mini-listbox' style='width: 250px; height: 200px;' showcheckbox='true'
        multiselect='true' textfield='ChineseName' valuefield='FieldName'>
    </div>
    <div style='float: right; padding-top: 6px;'>
        <a class='mini-button' iconcls='icon-excel' plain='false' onclick='{0}'>
            导出</a>
        <a class='mini-button' iconcls='icon-cancel' plain='false' onclick='{1}'>
            取消</a>
    </div>
</div>";

            sb.AppendLine(string.Format(strExcelWindowHTML,
                string.Format("downloadExcelData(\"{0}\",\"{1}\");", excelKey, gridId), string.Format("closeExcelWindow(\"{0}\")", excelKey), excelKey));

            return sb.ToString();
        }

        public string GetTreeGridSettings(string settings, List<Dictionary<string, object>> fields, bool isTreeGrid)
        {
            StringBuilder sb = new StringBuilder();
            if (isTreeGrid)
            {
                if (fields.Count > 0)
                {
                    var field = fields.FirstOrDefault(c => c["Visible"].ToString() == "true");
                    if (field != null)
                        sb.AppendFormat(" treeColumn='{0}'", field.GetValue("field"));
                }
                if (!string.IsNullOrEmpty(settings))
                {
                    var dic = JsonHelper.ToObject(settings);
                    if (string.IsNullOrEmpty(dic.GetValue("parentField")))
                        sb.Append(" parentField='ParentID'");
                    if (string.IsNullOrEmpty(dic.GetValue("idField")))
                        sb.Append(" idField='ID'");
                }
                sb.Append(" resultAsTree='false' ");
                sb.Append(" onload='onTreeGridLoad' ");
                sb.Append(" autoLoad='false' ");
            }
            return sb.ToString();
        }

        //
        #endregion

        #region CreateListScript


        public string CreateListScript(string code, bool isOutput = false)
        {
            string sql = "SELECT  * FROM S_UI_List";
            List<S_UI_List> uiLists = sqlHelper.ExecuteList<S_UI_List>(sql).Where(c => c.Code == code).ToList();
            S_UI_List listDef = uiLists.FirstOrDefault();

            if (listDef == null)
                throw new Exception(string.Format("列表【{0}】不存在", code));

            StringBuilder sb = new StringBuilder();

            var isColumnEdit = false; var showPager = false;
            if (!string.IsNullOrEmpty(listDef.LayoutGrid))
            {
                var settings = JsonHelper.ToObject(listDef.LayoutGrid);
                if (settings.GetValue("allowCellEdit") == "true")
                    isColumnEdit = true;
                if (settings.GetValue("showPager") == "true")
                    showPager = true;
            }
            var fields = JsonHelper.ToList(listDef.LayoutField);

            //确保快速查询与详细查询的查询结果是AND关系，前端已经修订，自定义列表需要将快速查询字段作为固定页面参数存在
            var quickQueryFields = fields.Where(c => c.ContainsKey("AllowSearch") && c["AllowSearch"].ToString() == "true");
            var serchFields = String.Join(",", quickQueryFields.Select(c => c["field"]).ToList());
            sb.AppendFormat("\n normalParamSettings.searchFields ='{0}'", serchFields);

            #region 字段详细
            foreach (var field in fields)
            {
                if (isColumnEdit)
                {
                    sb.AppendLine();
                    sb.Append(CreateEditListScript(listDef, field, isOutput));
                    continue;
                }
                if (!field.ContainsKey("Settings"))
                    continue;
                var settings = JsonHelper.ToObject(field["Settings"].ToString());

                if (!settings.ContainsKey("EnumKey") || settings["EnumKey"].ToString() == "")
                    continue;

                string enumKey = settings["EnumKey"].ToString();

                string tableName = listDef.TableNames.Split(',')[0];
                var key = GetEnumKey(tableName, field["field"].ToString(), enumKey);
                string enumStr = GetEnumString(listDef.ConnName, tableName, field["field"].ToString(), enumKey);

                if (isOutput)
                    sb.AppendFormat(GetOutputEnumString(listDef.ConnName, tableName, field["field"].ToString(), enumKey));
                else
                {
                    if (string.IsNullOrEmpty(enumStr))
                        enumStr = "[]";
                    sb.AppendFormat("\n var {0} = {1}", key, enumStr);
                }

                sb.AppendFormat("\n addGridEnum('dataGrid', '{0}', '{1}');", field["field"], key);
            }

            #endregion

            #region 按钮
            sb.AppendLine();
            var buttons = JsonHelper.ToList(listDef.LayoutButton);
            foreach (var item in buttons)
            {
                if (item.ContainsKey("Settings"))
                {
                    var sets = JsonHelper.ToObject(item["Settings"].ToString());
                    if (!sets.ContainsKey("Field") || string.IsNullOrEmpty(sets["Field"].ToString()))
                        continue;

                    Dictionary<string, object> dic = new Dictionary<string, object>();
                    var displayContent = "";
                    if (sets.ContainsKey("DisplayContent") && sets["DisplayContent"].ToString() != "")
                        displayContent = sets["DisplayContent"].ToString();
                    if (displayContent == "buttonIcon")
                        dic.Add("buttonClass", item["iconcls"]);
                    else if (displayContent == "buttonName")
                        dic.Add("linkText", item["text"]);

                    string addStr = "";
                    if (sets.ContainsKey("onclick") && !string.IsNullOrEmpty(sets["onclick"].ToString()))
                    {
                        dic.Add("onButtonClick", sets["onclick"].ToString());
                        addStr = string.Format("\n addGridButton('dataGrid','{0}',{1});", sets["Field"], JsonHelper.ToJson(dic));
                    }
                    else
                    {
                        if (sets.ContainsKey("PopupWidth") && sets["PopupWidth"].ToString() != "")
                            dic.Add("width", sets["PopupWidth"].ToString());
                        else
                            dic.Add("width", "1000");
                        if (sets.ContainsKey("PopupHeight") && sets["PopupHeight"].ToString() != "")
                            dic.Add("height", sets["PopupHeight"].ToString());
                        if (sets.ContainsKey("PopupTitle") && sets["PopupTitle"].ToString() != "")
                            dic.Add("title", sets["PopupTitle"].ToString());
                        if (sets.ContainsKey("Confirm") && sets["Confirm"].ToString() == "true")
                            dic.Add("mustConfirm", "true");
                        if (sets.ContainsKey("SelectMode") && sets["SelectMode"].ToString() != "")
                            dic.Add(sets["SelectMode"].ToString(), "true");

                        addStr = string.Format("\n addGridLink('dataGrid','{0}','{1}',{2});", sets["Field"], item["URL"], JsonHelper.ToJson(dic));
                    }

                    sb.Append(addStr);
                }

            }

            #endregion

            #region 详细查询
            sb.AppendLine();
            foreach (var field in fields)
            {
                if (!field.ContainsKey("ItemType") || field["ItemType"].ToString() != "ButtonEdit")
                    continue;

                if (!field.ContainsKey("QuerySettings"))
                    continue;
                string mode = field.ContainsKey("QueryMode") ? field["QueryMode"].ToString() : "";
                string queryMode = getQueryMode(mode);
                string name = string.Format("${0}${1}", queryMode, field["field"]);

                var dic = JsonHelper.ToObject<Dictionary<string, string>>(field["QuerySettings"].ToString());

                if (dic == null)
                    throw new Exception(string.Format("详细查询配置错误：{0}", field["field"]));

                if (dic["SelectorKey"].ToString() == "SystemUser")
                {
                    string rtnParam = "";
                    if (dic.ContainsKey("ReturnParams") && dic["ReturnParams"].ToString() != "")
                        rtnParam = ",{ returnParams:'" + dic["ReturnParams"].ToString() + "'}";

                    if (dic.ContainsKey("AllowMultiSelect") && dic["AllowMultiSelect"] == "true")
                        sb.AppendFormat("addMultiUserSelector('{0}'{1});\n", name, rtnParam);
                    else
                        sb.AppendFormat("addSingleUserSelector('{0}'{1});\n", name, rtnParam);
                }
                else if (dic["SelectorKey"].ToString() == "SystemOrg")
                {
                    string rtnParam = "";
                    if (dic.ContainsKey("ReturnParams") && dic["ReturnParams"].ToString() != "")
                        rtnParam = ",{ returnParams:'" + dic["ReturnParams"].ToString() + "'}";

                    if (dic.ContainsKey("AllowMultiSelect") && dic["AllowMultiSelect"] == "true")
                        sb.AppendFormat("addMultiOrgSelector('{0}'{1});\n", name, rtnParam);
                    else
                        sb.AppendFormat("addSingleOrgSelector('{0}'{1});\n", name, rtnParam);
                }
                else
                {
                    //
                }


            }

            #endregion

            #region 编辑列表按钮事件
            if (isColumnEdit)
            {
                if (showPager)
                {
                    var str = @"
                    var showConfirm = true;var loadData = {};
                    function onDataGridBeforeload(e) {
                        var grid = e.sender;
                        loadData = $.extend({}, e.data);
                        if (grid.getChanges().length > 0 && showConfirm) {
                            e.cancel = true;
                            msgUI('你有未保存的数据，是否继续操作？', 2, function (action) {
                                if (action == 'ok') {
                                    showConfirm = false;
                                    grid.load(loadData, function () { showConfirm = true; loadData = {} }, function () { showConfirm = true; loadData = {}});
                                }
                            });
                        }
                    }
";
                    sb.AppendLine(str);
                }
                var isTreeGrid = IsTreeGrid(listDef.LayoutGrid) ? "isTreeGrid:true" : "isTreeGrid:false";
                sb.Append(@"
                    function commitGridEdit(gridId) {
                        if(!gridId||typeof(gridId)=='object') gridId=normalParamSettings.gridId; 
                        var grid = mini.get(gridId);        
                        grid.commitEdit();grid.validate();
                    }
                    function moveUp(gridId) {
                        if(!gridId||typeof(gridId)=='object') gridId=normalParamSettings.gridId; 
                        var dataGrid = mini.get(gridId);
                        var rows = dataGrid.getSelecteds();
                        dataGrid.moveUp(rows);
                    }
                    function moveDown(gridId) {
                        if(!gridId||typeof(gridId)=='object') gridId=normalParamSettings.gridId; 
                        var dataGrid = mini.get(gridId);
                        var rows = dataGrid.getSelecteds();
                        dataGrid.moveDown(rows);
                    }    
                    function addEditRow() {
                        var defaultData = $.extend(true, {}, DefaultValueRowDic); 
                        addRow(defaultData, { isLast: " + (showPager ? "false" : "true") + ", " + isTreeGrid + @" });
                    }
                    function deleteEditRow(normalSettings) {
                        normalSettings = $.extend(true, {" + isTreeGrid + @"}, normalSettings); 
                        delRow(normalSettings);
                    }
                    function saveEditList(normalSettings) {
                        var settings = $.extend(true, {}, executeParamSettings, normalSettings);
                        normalSettings = $.extend(true, {" + isTreeGrid + @"}, normalSettings); 
                        var grid = mini.get(settings.gridId);
                        var deleteList = grid.getChanges(""removed"");
                        if(deleteList.length>0)
                        {
                            msgUI(""存在删除的数据，是否继续保存？"", 2, function (result) {
                                if (result != ""ok"") { return; }
                                " + (showPager ? "saveList" : "saveSortedList") + @"(normalSettings);
                            });
                        }
                        else
                            " + (showPager ? "saveList" : "saveSortedList") + @"(normalSettings);
                    }
                    function clientSearch(searchFields, normalSettings) {
                        var settings = $.extend(true, {}, normalParamSettings, normalSettings);

                        var grid = mini.get(settings.gridId);

                        var keyCo = mini.get(settings.queryBoxId);
                        if (keyCo == undefined) {
                            msgUI(""当前快速查询文本框"" + settings.queryBoxId + ""不存在，请重新检查！"", 1);
                            return;
                        }
                        var searchValues = keyCo.getValue().toLowerCase().replace(/，/g, ',');
                        if (grid != undefined)
                            grid.filter(function (row) {
                                //逗号 或关系
                                var result = false;
                                var keys = searchFields.split(',');
                                var values = searchValues.split(',');
                                for (i = 0; i < keys.length; i++) {
                                    for (var j = 0; j < values.length; j++) {
                                        result = result || String(row[keys[i]]).toLowerCase().indexOf(values[j]) != -1;
                                    }
                                }
                                return result;
                            });
                    }
                    ");
            }
            #endregion

            #region 数据源
            var defaultValueRows = GetDefaultValueDic(listDef.DefaultValueSettings);
            foreach (var key in defaultValueRows.Keys)
            {
                var guid = new Guid();
                if (Guid.TryParse(key, out guid) == false)
                    sb.AppendFormat("\n var {0}={1}", key, JsonHelper.ToJson(defaultValueRows[key]));
            }
            #endregion

            #region 默认值列表
            if (isColumnEdit)
            {
                //默认值Dic
                var defaultDic = new Dictionary<string, string>();
                foreach (var field in fields)
                {
                    var _ItemType = field.GetValue("Edit_ItemType");
                    var _DefaultValue = field.GetValue("Edit_DefaultValue");
                    var _Code = field.GetValue("field");
                    if (string.IsNullOrEmpty(_DefaultValue))
                        continue;
                    if (_DefaultValue.Contains(',') && _ItemType == "ButtonEdit")
                    {
                        defaultDic.Add(_Code, GetDefaultValue(_Code, _DefaultValue.Split(',').First(), defaultValueRows));
                        defaultDic.Add(_Code + "Name", GetDefaultValue(_Code, _DefaultValue.Split(',').Last(), defaultValueRows));
                    }
                    else
                    {
                        defaultDic.Add(_Code, GetDefaultValue(_Code, _DefaultValue, defaultValueRows));
                    }
                }
                sb.AppendFormat("\n var {0}={1};", "DefaultValueRowDic", JsonHelper.ToJson(defaultDic));
            }
            #endregion

            return sb.ToString() + "\n" + HttpUtility.HtmlDecode(listDef.ScriptText);

        }
        //
        public string CreateEditListScript(S_UI_List listDef, Dictionary<string, object> field, bool isOutput = false)
        {
            StringBuilder sb = new StringBuilder();
            var _ItemType = field.GetValue("Edit_ItemType");
            var _Code = field.GetValue("field");
            var _Name = field.GetValue("header");
            var _Edit_Settings = field.GetValue("Edit_Settings");
            var miniuiSettings = GetMiniuiSettings(_Edit_Settings);
            var _GridId = "dataGrid";

            #region 选择器脚本

            if (_ItemType == "ButtonEdit")
            {
                string selectorName = _GridId + "_" + _Code;

                var dic = JsonHelper.ToObject<Dictionary<string, string>>(_Edit_Settings);

                string returnParams = "value:ID,text:Name";
                if (dic.ContainsKey("ReturnParams"))
                    returnParams = dic["ReturnParams"];

                if (dic["SelectorKey"].ToString() == "SystemUser")
                {
                    if (dic.ContainsKey("AllowMultiSelect") && dic["AllowMultiSelect"] == "true")
                        sb.AppendFormat("addMultiUserSelector('{0}',{{returnParams:'{1}'}});\n", selectorName, returnParams);
                    else
                        sb.AppendFormat("addSingleUserSelector('{0}',{{returnParams:'{1}'}});\n", selectorName, returnParams);
                }
                else if (dic["SelectorKey"].ToString() == "SystemOrg")
                {
                    StringBuilder paramStr = new StringBuilder();
                    if (dic.ContainsKey("UrlParams") && dic["UrlParams"] != "")
                    {
                        var paramSettings = dic["UrlParams"].Split('&');
                        foreach (var param in paramSettings)
                        {
                            var keyValue = param.Split('=');
                            paramStr.Append(keyValue[0]);
                            paramStr.Append(":'");
                            paramStr.Append(keyValue.Length > 1 ? keyValue[1] : "");
                            paramStr.Append("',");
                        }
                    }

                    if (dic.ContainsKey("AllowMultiSelect") && dic["AllowMultiSelect"] == "true")
                        sb.AppendFormat("addMultiOrgSelector('{0}',{{{2} returnParams:'{1}'}});\n", selectorName, returnParams, paramStr.ToString());
                    else
                        sb.AppendFormat("addSingleOrgSelector('{0}',{{{2} returnParams:'{1}'}});\n", selectorName, returnParams, paramStr.ToString());
                }
            }
            #endregion

            #region 下拉选择枚举
            if (_ItemType == "ComboBox")
            {
                var dic = JsonHelper.ToObject(_Edit_Settings);
                var data = dic.GetValue("data");
                if (!string.IsNullOrEmpty(data))
                {
                    string tableName = listDef.TableNames.Split(',')[0] + "_" + _GridId;
                    string key = GetEnumKey(tableName, _Code, data);
                    string enumStr = GetEnumString(listDef.ConnName, tableName, _Code, data);
                    if (isOutput)
                        sb.AppendFormat(GetOutputEnumString(listDef.ConnName, tableName, _Code, data));
                    else
                    {
                        if (string.IsNullOrEmpty(enumStr))
                            enumStr = "[]";
                        sb.AppendFormat("\n var {0} = {1}; ", key, enumStr);
                    }
                    sb.AppendFormat("\n addGridEnum('{0}', '{1}', '{2}');", _GridId, _Code, key);
                }
            }

            #endregion

            return sb.ToString();
        }
        //

        private string GetEnumString(string connName, string tableName, string fieldCode, string data)
        {
            bool fromMeta = false;
            if (data.StartsWith("[") == false)
            {
                var arr = data.Split(',');
                if (arr.Length == 3) //如果data为ConnName,tableName,fieldCode时
                {
                    connName = arr[0];
                    tableName = arr[1];
                    fieldCode = arr[2];
                    fromMeta = true;
                }
                else if (arr.Length == 2)//如果data为tableName,fieldCode时
                {
                    tableName = arr[0];
                    fieldCode = arr[1];
                    fromMeta = true;
                }
            }

            string result = "";
            if (data.StartsWith("["))
            {
                result = data;
            }
            else if (data == "" || data == "FromMeta" || fromMeta == true)
            {
                //TODO 获取定义的数据库枚举,UIFO
            }
            else
            {
                //
            }

            return result;
        }
        //
        private string GetOutputEnumString(string connName, string tableName, string fieldCode, string data)
        {
            bool fromMeta = false;
            if (data.StartsWith("[") == false)
            {
                var arr = data.Split(',');
                if (arr.Length == 3) //如果data为ConnName,tableName,fieldCode时
                {
                    connName = arr[0];
                    tableName = arr[1];
                    fieldCode = arr[2];
                    fromMeta = true;
                }
                else if (arr.Length == 2)//如果data为tableName,fieldCode时
                {
                    tableName = arr[0];
                    fieldCode = arr[1];
                    fromMeta = true;
                }
            }

            string result = "";
            if (data.StartsWith("[") == true)
            {
                result = string.Format("\n var enum_{0}_{1} = {2}; ", tableName, fieldCode, data);
            }
            else if (data == "" || data == "FromMeta" || fromMeta == true)
            {
                result = string.Format("\n @Html.GetMetaEnum('{0}','{1}','{2}')", connName, tableName, fieldCode);
            }
            else
            {
                result = string.Format("\n @Html.GetEnum('{0}')", data);
            }
            return result;
        }
        #endregion
        //


        #region CreateFormHtml

        public string CreateFormHtml(S_UI_Form formInfo)
        {
            string uiRegStr = "\\{[()（），。、；,.;0-9a-zA-Z_\u4e00-\u9faf]*\\}";
            var items = JsonHelper.ToObject<List<FormItem>>(formInfo.Items);
            Regex reg = new Regex(uiRegStr);

            string layout = formInfo.Layout;

            string script = "";
            //去除所有的换行符号，以免样式出现多余的空格
            layout = Regex.Replace(layout, "<br/>|<BR/>", (Match m) => { return ""; });
            Regex regHelper = new Regex(@"(?<=>)([\n\s\S]*?)(?=<)");
            layout = regHelper.Replace(layout ?? "", (Match m) =>
            {
                string value = m.Value.Trim(' ', '\n', '\t');
                if (value.StartsWith("{"))
                    return m.Value;
                var item = items.SingleOrDefault(c => c.Name == value);
                if (item == null)
                    return m.Value;
                return null;
            });

            var str = "<script type='text/javascript'>";
            str += script;
            str += "\n</script>";
            layout = str + layout;

            string result = reg.Replace(layout ?? "", (Match m) =>
            {
                string value = m.Value.Trim('{', '}');
                FormItem item = items.SingleOrDefault(c => c.Name == value);
                if (item == null) return m.Value;
                return GetFormItemHtml(formInfo, item);

            });

            return result;
        }

        private string GetFormItemHtml(S_UI_Form formInfo, FormItem item)
        {
            #region 控件类型为子表时

            if (item.ItemType == "SubTable")
            {
                return CreateSubTableHtml(formInfo, item);
            }

            #endregion

            string miniuiSettings = GetMiniuiSettings(item.Settings);
            if (miniuiSettings == "")
            {
                if (item.ItemType == "MultiFile") //增加兼容写法：流程路由的动态判断必填显示正常
                    miniuiSettings = "required='false' style='width:100%'";
                else
                    miniuiSettings = "style='width:100%'";
            }
            string dataPty = ""; //控件的data属性

            if (item.ItemType == "TextBox" | item.ItemType == "TextArea")
            {
                if (!miniuiSettings.Contains("maxLength"))
                {
                    if (item.FieldType == "nvarchar(50)")
                        miniuiSettings += " maxLength='50'";
                    if (item.FieldType == "nvarchar(200)")
                        miniuiSettings += " maxLength='200'";
                    if (item.FieldType == "nvarchar(500)")
                        miniuiSettings += " maxLength='500'";
                    if (item.FieldType == "nvarchar(2000)")
                        miniuiSettings += " maxLength='2000'";
                }
            }
            else if (item.ItemType == "UEditor")
            {
                string height = "250px";
                if (!string.IsNullOrEmpty(item.Settings))
                {
                    var dic = JsonHelper.ToObject(item.Settings);
                    height = dic["style_height"].ToString();
                }
                return string.Format("<script id='{0}' name='{0}' class='UEditor' type='text/plain' style='width:100%;height:{1}'></script>", item.Code, height);
            }
            else if (item.ItemType == "CheckBoxList" || item.ItemType == "RadioButtonList" || item.ItemType == "ComboBox")
            {
                dataPty = GetFormItemDataPty(formInfo.TableName, item.Code, item.Settings);
            }

            return string.Format("<input name='{0}' {5} class='mini-{1}' {2} {3} {4} {6}/>"
                , item.Code, item.ItemType.ToLower(), miniuiSettings
                , item.Enabled == "true" ? "" : "enabled='false'"
                , item.Visible == "true" ? "" : "visible='false'"
                , item.ItemType == "ButtonEdit" ? string.Format("textName='{0}Name'", item.Code) : ""
                , dataPty
                );
        }

        #endregion


        #region CreateSubTableHtml

        private string CreateSubTableHtml(S_UI_Form formInfo, FormItem formItem)
        {
            if (string.IsNullOrEmpty(formItem.Settings))
                return "";
            var dic = JsonHelper.ToObject(formItem.Settings);
            if (string.IsNullOrEmpty(dic.GetValue("listData")))
                return "";
            var list = JsonHelper.ToObject<List<FormItem>>(dic["listData"].ToString());
            if (list.Count == 0)
                return "";

            //默认值Dic
            var defaultDic = new Dictionary<string, string>();
            foreach (var item in list)
            {

                if (string.IsNullOrEmpty(item.DefaultValue))
                    continue;
                if (item.DefaultValue.Contains(',') && item.ItemType == "ButtonEdit")
                {
                    defaultDic.Add(item.Code, GetDefaultValue(item.Code, item.DefaultValue.Split(',').First(), GetDefaultValueDic(formInfo.DefaultValueSettings)));
                    defaultDic.Add(item.Code + "Name", GetDefaultValue(item.Code, item.DefaultValue.Split(',').Last(), GetDefaultValueDic(formInfo.DefaultValueSettings)));
                }
                else
                {
                    defaultDic.Add(item.Code, GetDefaultValue(item.Code, item.DefaultValue, GetDefaultValueDic(formInfo.DefaultValueSettings)));
                }
            }

            string miniuiSettings = GetMiniuiSettings(dic["formData"].ToString());
            if (miniuiSettings == "")
                miniuiSettings = "style='width:100%;height:100px;'";

            var dicSubTableSettings = JsonHelper.ToObject(dic["formData"].ToString());
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat(@"
<div id='toolbar{3}' class='mini-toolbar'  style='height:25px;border-bottom: 0px;{4}'>
    <table>
        <tr>
            <td style='text-align:left;'>
                <a class='mini-button' id='btn{3}Add' iconcls='icon-add' onclick='addRow({0});' visible='{5}'>添加</a>
                <a class='mini-button' id='btn{3}Delete' iconcls='icon-remove' onclick='delRow({1});' visible='{6}'>移除</a>
                <a class='mini-button' iconcls='icon-up' onclick='moveUp({2});' visible='{7}'>上移</a>
                <a class='mini-button' iconcls='icon-down' onclick='moveDown({2});' visible='{8}'>下移</a>
            </td>
        </tr>
    </table>
</div>
", JsonHelper.ToJson(defaultDic) + ",{gridId:\"" + formItem.Code + "\",isLast:true}"
 , "{gridId:\"" + formItem.Code + "\"}"
 , "\"" + formItem.Code + "\""
 , formItem.Code
 , dicSubTableSettings.ContainsKey("ShowToolbar") && dicSubTableSettings["ShowToolbar"].ToString() == "false" ? "display:none;" : ""
 , dicSubTableSettings.ContainsKey("ShowBtnAdd") && dicSubTableSettings["ShowBtnAdd"].ToString() == "false" ? "false" : "true"
 , dicSubTableSettings.ContainsKey("ShowBtnRemove") && dicSubTableSettings["ShowBtnRemove"].ToString() == "false" ? "false" : "true"
 , dicSubTableSettings.ContainsKey("ShowBtnUp") && dicSubTableSettings["ShowBtnUp"].ToString() == "false" ? "false" : "true"
 , dicSubTableSettings.ContainsKey("ShowBtnDown") && dicSubTableSettings["ShowBtnDown"].ToString() == "false" ? "false" : "true"
 );


            sb.AppendFormat(@" 
        <div id='{0}' {1} {2} {3} class='mini-datagrid' {4} {5} allowcellvalid='true' multiselect='true' allowcelledit='true' allowcellselect='true' showpager='false' allowUnselect='false' sortMode='client'>
 ", formItem.Code, miniuiSettings
  , formItem.Enabled == "true" ? "" : "enabled='false'"
  , formItem.Visible == "true" ? "" : "visible='false'"
  , dicSubTableSettings.GetValue("IsVirtualScroll") == "true" ? "virtualScroll='true'" : ""
  , dicSubTableSettings.GetValue("IsVirtualColumns") == "true" ? "virtualColumns='true'" : ""
  );
            sb.Append(@"
 <div property='columns'>
");
            if (dicSubTableSettings.ContainsKey("showIndexColumn") && dicSubTableSettings["showIndexColumn"].ToString() == "true")
            {
                sb.Append(@"
            <div type='indexcolumn'></div>
");
            }

            if (dicSubTableSettings.ContainsKey("showCheckColumn") && dicSubTableSettings["showCheckColumn"].ToString() == "true")
            {
                sb.AppendFormat(@"       
            <div type='checkcolumn'></div>
");
            }


            string currentTopHeader = "";
            foreach (var item in list)
            {
                if (item.Visible == "false")
                    continue;
                #region 获取vtype
                string vtype = "";
                if (!string.IsNullOrEmpty(item.Settings))
                {
                    var _dic = JsonHelper.ToObject<Dictionary<string, string>>(item.Settings);
                    if (_dic.ContainsKey("required") && _dic["required"] == "true")
                        vtype += "required;";
                    if (_dic.ContainsKey("vtype"))
                        vtype += _dic["vtype"];
                }
                #endregion

                #region 特殊控件处理
                if (item.ItemType == "CheckBox")
                {
                    sb.AppendFormat("\n<div type='checkboxcolumn' field='{0}' header='{1}' {2} {3}></div>"
                        , item.Code
                        , item.Name
                        , GetMiniuiSettings(JsonHelper.ToJson(item))
                        , GetMiniuiSettings(item.Settings)
                        );
                    continue;
                }
                else if (item.ItemType == "SingleFile")
                {
                    sb.AppendFormat(@"
<div field='{0}' displayfield='{0}Name' header='{1}' {2}  renderer='onFileRender' {4}>
    <input property='editor' class='mini-fileupload' onclick='btnUploadifiveClick' style='width: 100%;' label='{3}' />  
</div>"
                       , item.Code
                       , item.Name
                       , GetMiniuiSettings(JsonHelper.ToJson(item))
                       , item.Settings
                       , vtype == "" ? "" : string.Format("vtype='{0}'", vtype)
                       );
                    continue;
                }
                #endregion

                var subTableItemCode = formItem.Code + "." + item.Code;

                miniuiSettings = GetMiniuiSettings(item.Settings ?? "");
                if (miniuiSettings == "")
                    miniuiSettings = "style='width:100%'";

                string ColumnSettings = GetMiniuiSettings(item.ColumnSettings ?? "");//列格式

                string dataPty = "";
                if (item.ItemType == "ComboBox")
                {
                    string tableName = formInfo.TableName + "_" + formItem.Code;
                    dataPty = GetFormItemDataPty(tableName, item.Code, item.Settings);
                }

                string comboBoxPty = "type='comboboxcolumn'";
                if (item.ItemType == "ComboBox")
                {
                    var columSettingsDic = JsonHelper.ToObject(item.Settings);
                    if (columSettingsDic.ContainsKey("textName") && columSettingsDic["textName"].ToString() != "")
                        comboBoxPty = string.Format("displayField='{0}'", columSettingsDic["textName"]);
                }

                //多表头处理
                string header = item.Name;
                if (header == null) header = "";
                //判断闭合
                if (currentTopHeader != "" && header.StartsWith(currentTopHeader + ".") == false)
                {
                    sb.AppendLine("</div></div>");
                    currentTopHeader = "";
                }
                if (header.Contains('.'))
                {
                    string topHeader = header.Split('.').First();

                    if (topHeader != currentTopHeader)
                    {
                        currentTopHeader = topHeader;
                        //新的多表头                       
                        sb.AppendFormat("<div header='{0}' headerAlign='center'><div property='columns'>", topHeader);
                    }
                }

                string itemHtml = CreateSubTableItem(item, ColumnSettings, miniuiSettings, vtype, comboBoxPty, dataPty, formItem.Code);
                sb.Append(itemHtml);
            }
            //循环结束，闭合多表头
            if (currentTopHeader != "")
            {
                currentTopHeader = "";
                sb.AppendLine("</div></div>");
            }

            sb.AppendFormat(@"
                </div>
            </div>");
            return sb.ToString();
        }

        private string CreateSubTableItem(FormItem item, string ColumnSettings, string miniuiSettings, string vtype, string comboBoxPty, string dataPty, string formItemCode)
        {
            var name = item.Name.Split('.').LastOrDefault();
            Dictionary<string, object> dic = new Dictionary<string, object>();
            if (!string.IsNullOrWhiteSpace(item.ColumnSettings))
                dic = JsonHelper.ToObject(item.ColumnSettings);
            string html = string.Format(@"
        <div name='{3}' field='{3}' {8} header='{4}' {5} {6} {7} {0} autoShowPopup='true' {12} {13} allowSort='true'>
                <input {9} property='editor' class='mini-{1}' {2} {10} {11} {14} />
        </div>"
            , GetMiniuiSettings(JsonHelper.ToJson(item))
            , item.ItemType.ToLower()
            , miniuiSettings
            , item.Code
            , name
            , item.ItemType == "DatePicker" && ColumnSettings.IndexOf("dateFormat") >= 0 ? "dateFormat='" + dic.GetValue("dateFormat") + "'" : ""
            , item.ItemType == "ComboBox" ? comboBoxPty : ""
            , vtype == "" ? "" : string.Format("vtype='{0}'", vtype)
            , item.ItemType == "ButtonEdit" ? "displayfield='" + item.Code + "Name'" : ""
            , item.ItemType == "ButtonEdit" ? " name='" + formItemCode + "_" + item.Code + "'" : ""  
            , item.ItemType == "ComboBox" && miniuiSettings.Contains("multiselect='true'") == false && miniuiSettings.Contains("onitemclick=") == false ? "onitemclick=\"commitGridEdit('" + formItemCode + "');\"" : ""
            , item.ItemType == "DatePicker" ? "onhidepopup=\"commitGridEdit('" + formItemCode + "');\"" : ""
            , string.IsNullOrEmpty(item.SummaryType) ? "" : string.Format("summaryType='{0}' summaryRenderer='onSummaryRenderer'", item.SummaryType)
            , ColumnSettings
            , dataPty
            );
            return html;
        }

        #endregion


        #region CreateFormHiddenHtml

        public string CreateFormHiddenHtml(S_UI_Form form)
        {
            StringBuilder sb = new StringBuilder();
            var items = JsonHelper.ToObject<List<FormItem>>(form.Items).Where(c => String.IsNullOrWhiteSpace(c.ItemType));

            foreach (var item in items)
            {
                sb.AppendFormat("\n<input name=\"{0}\" class=\"mini-hidden\" />", item.Code);
            }

            items = JsonHelper.ToObject<List<FormItem>>(form.Items).Where(c => !String.IsNullOrWhiteSpace(c.ItemType) && c.Visible == "false");
            foreach (var item in items)
            {
                if (item.ItemType == "SubTable")
                    continue;
                sb.AppendFormat(GetFormItemHtml(form, item));
            }

            return sb.ToString();
        }

        #endregion

        #region CreateFormScript

        public string CreateFormScript(S_UI_Form form, bool isOutput = false)
        {
            StringBuilder sb = new StringBuilder("\n");
            var list = JsonHelper.ToObject<List<FormItem>>(form.Items);

            #region 添加系统枚举

            //获取数据源配置信息，枚举如果是设置的数据源，后续则不再进行枚举获取
            var defaultValueSettings = new List<Dictionary<string, object>>();
            if (!String.IsNullOrEmpty(form.DefaultValueSettings))
            {
                defaultValueSettings = JsonHelper.ToList(form.DefaultValueSettings);
            }
            foreach (var item in list)
            {
                if (string.IsNullOrEmpty(item.Settings))
                    continue;
                if (item.ItemType == "CheckBoxList" || item.ItemType == "RadioButtonList" || item.ItemType == "ComboBox")
                {
                    var dic = JsonHelper.ToObject(item.Settings);
                    var data = dic["data"].ToString().Trim();
                    if (data == "")
                        continue;

                    //获取数据源配置信息，枚举如果是设置的数据源，后续则不再进行枚举获取
                    if (!data.StartsWith("[") && data.Split('.').Length == 1)
                    {
                        if (defaultValueSettings.Exists(c => c.ContainsKey("Code") && c["Code"].ToString() == data))
                            continue;
                    }

                    var key = GetEnumKey(form.TableName, item.Code, data);
                    var enumStr = GetEnumString(form.ConnName, form.TableName, item.Code, data);

                    if (!string.IsNullOrEmpty(enumStr))
                    {
                        if (isOutput)
                            sb.Append(GetOutputEnumString(form.ConnName, form.TableName, item.Code, data));
                        else
                            sb.AppendFormat("\n var {0} = {1}; ", key, enumStr);
                    }
                }

                if (item.ItemType == "SubTable")
                {
                    var _dic = JsonHelper.ToObject(item.Settings);
                    var subTableItems = JsonHelper.ToObject<List<FormItem>>(_dic["listData"].ToString());
                    foreach (var subItem in subTableItems)
                    {
                        if (string.IsNullOrEmpty(subItem.Settings))
                            continue;
                        if (subItem.ItemType == "ComboBox")
                        {
                            var dic = JsonHelper.ToObject(subItem.Settings);
                            var data = dic["data"].ToString().Trim();
                            if (data == "")
                                continue;

                            string tableName = form.TableName + "_" + item.Code;
                            string key = GetEnumKey(tableName, subItem.Code, data);
                            string enumStr = GetEnumString(form.ConnName, tableName, subItem.Code, data);
                            if (!string.IsNullOrEmpty(enumStr))
                            {
                                if (isOutput)
                                    sb.AppendFormat(GetOutputEnumString(form.ConnName, tableName, subItem.Code, data));
                                else
                                    sb.AppendFormat("\n var {0} = {1}; ", key, enumStr);
                            }
                        }
                    }
                }
            }

            #endregion

            sb.Append(@"
function commitGridEdit(gridId) { 
    var grid = mini.get(gridId);        
    grid.commitEdit();    
}
function moveUp(gridId) {
    var dataGrid = mini.get(gridId);
    var rows = dataGrid.getSelecteds();
    dataGrid.moveUp(rows);
}
function moveDown(gridId) {
    var dataGrid = mini.get(gridId);
    var rows = dataGrid.getSelecteds();
    dataGrid.moveDown(rows);
}    
");
            sb.AppendLine();
            sb.Append(HtmlEncoder.Default.Encode(form.ScriptText));

            return sb.ToString();
        }

        #endregion


        public List<string> GetFixedWidthFields(string code)
        {
            string sql = "SELECT  * FROM S_UI_List";
            List<S_UI_List> uiLists = sqlHelper.ExecuteList<S_UI_List>(sql).Where(c => c.Code == code).ToList();
            S_UI_List listDef = uiLists.FirstOrDefault();

            if (listDef == null)
                throw new Exception(string.Format("列表【{0}】不存在", code));
            var fields = JsonHelper.ToList(listDef.LayoutField);
            Regex reg = new Regex(@"^[1-9]\d*$");
            List<string> list = new List<string>();
            foreach (var field in fields)
            {
                if (field.Keys.ToList().Exists(o => o.ToLower() == "width") && reg.IsMatch(field["width"].ToString()))
                {
                    list.Add(field["field"].ToString().ToUpper());
                }
            }
            return list;
        }

        public DataTable GetFieldInfo(S_UI_Form form)
        {
            var itemList = form.Items;
            var list = JsonHelper.ToObject<List<FormItem>>(itemList);
            DataTable table = new DataTable();
            table.Rows.Add(table.NewRow());
            foreach (var item in list)
            {
                DataColumn dc = new DataColumn(item.Code, typeof(string));
                table.Columns.Add(dc);
                table.Rows[0][item.Code] = item.Name;
            }
            return table;
        }
        //

        // GetList

        #region String替换

        /// <summary>
        /// 替换{}内容为当前地址栏参数或当前人信息
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="row"></param>
        /// <returns></returns>
        public string ReplaceDicString(string sql, DataRow row = null, Dictionary<string, object> dic = null,
            Dictionary<string, DataTable> dtDic = null, bool validateCurrentUser = true)
        {
            if (string.IsNullOrEmpty(sql))
                return sql;
            //TODO 自动替换人员用户信息
            Regex reg = new Regex("\\{[0-9a-zA-Z_\\.]*\\}");
            string result = reg.Replace(sql, (Match m) =>
            {
                string value = m.Value.Trim('{', '}');

                if (dtDic != null && dtDic.Count > 0)
                {
                    var arr = value.Split('.');
                    if (arr.Length == 1)
                    {
                        if (dtDic.ContainsKey(value)) //默认值为整个表
                            return JsonHelper.ToJson(dtDic[value]);
                    }
                    else if (arr.Length == 2) //默认子编号名.字段名
                    {
                        if (dtDic.ContainsKey(arr[0]))
                        {
                            var dt = dtDic[arr[0]];
                            if (dt.Rows.Count > 0 && dt.Columns.Contains(arr[1]))
                            {
                                return dt.Rows[0][arr[1]].ToString();
                            }
                        }
                    }
                }
                if (row != null && row.Table.Columns.Contains(value))
                    return row[value].ToString();
                if (dic != null && dic.ContainsKey(value))
                    return dic.GetValue(value);

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

            return result;
        }
        #endregion

        //
    }
}
