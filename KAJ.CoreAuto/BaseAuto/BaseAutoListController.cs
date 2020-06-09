using KAJ.Common.Helper;
using KAJ.CoreAuto.BaseFormula;
using KAJ.IServices;
using KAJ.Model.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KAJ.CoreAuto.BaseAuto
{
    public class BaseAutoListController : Controller
    {

        private readonly SQLHelper sqlHelper = SQLHelper.CreateSqlHelper();

        public virtual IActionResult CoreView()
        #region
        {
            string tmplCode = Request.Query["tmplCode"].ToString();
            string sql = "SELECT  * FROM S_UI_List";
            List<S_UI_List> uiLists = sqlHelper.ExecuteList<S_UI_List>(sql).Where(c => c.Code == tmplCode).ToList();
            S_UI_List listDef = uiLists.FirstOrDefault();

            UIBuilder uiFO = new UIBuilder();
            ViewBag.ListHtml = uiFO.CreateListHtml(tmplCode);
            ViewBag.Script = uiFO.CreateListScript(tmplCode);
            ViewBag.RightKeyHtml = "";
            ViewBag.FixedFields = string.Format("var FixedFields={0};", Newtonsoft.Json.JsonConvert.SerializeObject(uiFO.GetFixedWidthFields(tmplCode)));
            ViewBag.Title = listDef.Name;
            ViewBag.VirtualScroll = "false";
            var isColumnEdit = false;
            if (!string.IsNullOrEmpty(listDef.LayoutGrid))
            {
                var settings = JsonHelper.ToObject(listDef.LayoutGrid);
                if (settings.GetValue("allowCellEdit") == "true")
                    isColumnEdit = true;
                if (!String.IsNullOrEmpty(settings.GetValue("virtualScroll")))
                {
                    ViewBag.VirtualScroll = settings.GetValue("virtualScroll");
                }
            }

            var tab = new Tab();
            if (!isColumnEdit)
            {
                //不可标签式查询
                var fields = JsonHelper.ToList(listDef.LayoutField);
                foreach (var field in fields)
                {
                    if (!field.ContainsKey("Settings"))
                        continue;
                    var settings = JsonHelper.ToObject(field["Settings"].ToString());

                    if (!settings.ContainsKey("EnumKey") || settings["EnumKey"].ToString() == "")
                        continue;

                    if (!settings.ContainsKey("TabSearchName") || settings["TabSearchName"].ToString() == "")
                        continue;


                    UICategory category = null;

                    //根据配置决定是否显示‘全部’选项
                    var hasAllAttr = true;
                    string enumKey = settings["EnumKey"].ToString();

                    if (settings.ContainsKey("ShowAll") && settings["ShowAll"].ToString() == "false"
                        && settings.ContainsKey("TabSearchDefault") && !String.IsNullOrEmpty(settings["TabSearchDefault"].ToString()))
                    {
                        hasAllAttr = false;
                    }
                    category = CategoryFactory.GetCategoryByString(enumKey, settings["TabSearchName"].ToString(), field["field"].ToString(), hasAllAttr);


                    //默认值
                    if (settings.ContainsKey("TabSearchDefault") && settings["TabSearchDefault"].ToString() != "")
                        category.SetDefaultItem(settings["TabSearchDefault"].ToString());
                    else
                        category.SetDefaultItem();

                    //多选或单选
                    if (settings.ContainsKey("TabSearchMulti") && settings["TabSearchMulti"].ToString() == "false")
                        category.Multi = false;
                    else
                        category.Multi = true;

                    tab.Categories.Add(category);
                }
            }

            if (tab.Categories.Count > 0)
            {
                tab.IsDisplay = true;
                ViewBag.Tab = tab;
                ViewBag.Layout = "~/Views/Shared/_AutoListLayoutTab.cshtml";
            }
            else
            {
                ViewBag.Layout = "~/Views/Shared/_Layout.cshtml";
            }

            return View();
        }
        #endregion

        public JsonResult GetList()
        {
            var aa = Request;
            string tmplCode = aa.Query["tmplCode"].ToString();
            string id = aa.Query["ID"].ToString();
            var bb = HttpContext;
            var cc = HttpContext.Request;
            return Json("");
        }

        /*
         * 暂时
        public virtual JsonResult GetList(string tmplCode, QueryBuilder qb)
        #region

        {
            var listDef = entities.Set<S_UI_List>().SingleOrDefault(c => c.Code == tmplCode);
            SQLHelper sqlHeler = SQLHelper.CreateSqlHelper(listDef.ConnName);

            UIFO uiFO = FormulaHelper.CreateFO<UIFO>();

            var lefSettings = JsonHelper.ToObject(listDef.LayoutGrid);
            if (lefSettings.GetValue("isTreeGrid") == true.ToString().ToLower() &&
                this.Request["IsLoadChildren"] == true.ToString().ToLower())
            {
                //异步加载树列表
                var node = String.IsNullOrEmpty(this.Request["NodeInfo"]) ? new Dictionary<string, object>() :
                    JsonHelper.ToObject<Dictionary<string, object>>(this.Request["NodeInfo"]);
                var defaultValues = JsonHelper.ToList(listDef.DefaultValueSettings);
                var nodeTypeField = String.IsNullOrEmpty(lefSettings.GetValue("NodeTypeField")) ? "NodeType" : lefSettings.GetValue("NodeTypeField");
                var nodeType = String.IsNullOrEmpty(node.GetValue(nodeTypeField)) ? "Root" : node.GetValue(nodeTypeField);
                var treeGridDataSource = defaultValues.Where(c => c.GetValue("treeGridSource") == true.ToString().ToLower()).ToList();
                var dataSource = new Dictionary<string, object>();
                if (treeGridDataSource.Count == 1)
                {
                    dataSource = treeGridDataSource.FirstOrDefault();
                }
                else
                {
                    dataSource = treeGridDataSource.FirstOrDefault(c => c.GetValue("Code").Split(',').Contains(nodeType));
                }
                if (dataSource == null)
                {
                    return Json(new DataTable());
                }
                var db = SQLHelper.CreateSqlHelper(dataSource.GetValue("ConnName"));
                var sourceSQL = dataSource.GetValue("SQL");
                sourceSQL = uiFO.ReplaceDicString(sourceSQL, null, node);
                var children = db.ExecuteDataTable(sourceSQL, new SearchCondition());
                return Json(children);
            }
            else
            {
                string sql = listDef.SQL;
                #region TAB查询
                //解决tab查询需要在sql中间的问题
                var tabData = Request["queryTabData"];
                var fields = JsonHelper.ToList(listDef.LayoutField);
                var tabEmbeddedFields = new Dictionary<string, string>();
                foreach (var field in fields)
                {
                    if (!field.ContainsKey("Settings"))
                        continue;
                    var settings = JsonHelper.ToObject(field["Settings"].ToString());
                    if (!settings.ContainsKey("TabSearchName") || settings["TabSearchName"].ToString() == "")
                        continue;
                    if (!settings.ContainsKey("Embedded") || settings["Embedded"].ToString() != true.ToString().ToLower())
                        continue;

                    var cnd = qb.Items.FirstOrDefault(c => c.Field == field["field"].ToString());
                    if (cnd != null)
                    {
                        qb.Items.Remove(cnd);
                        var value = cnd.Value.ToString();
                        if (value.Contains(",") && (cnd.Method == QueryMethod.InLike || cnd.Method == QueryMethod.In))
                        {
                            value = value.Replace(",", "','");
                        }
                        tabEmbeddedFields.Add(field["field"].ToString(), value);
                    }
                    else
                    {
                        if (!settings.ContainsKey("EnumKey") || settings["EnumKey"].ToString() == "")
                            continue;
                        string enumKey = settings["EnumKey"].ToString();
                        var enumList = new List<Dictionary<string, object>>();
                        if (enumKey.StartsWith("["))
                            enumList = JsonHelper.ToList(enumKey);
                        else
                        {
                            var enumServcie = FormulaHelper.GetService<IEnumService>();
                            var dataTable = enumServcie.GetEnumTable(enumKey);
                            enumList = FormulaHelper.DataTableToListDic(dataTable);
                        }
                        var value = String.Join(",", enumList.Select(c => c["value"].ToString()).ToList());
                        if (value.Contains(","))
                        {
                            value = value.Replace(",", "','");
                        }
                        tabEmbeddedFields.Add(field["field"].ToString(), value);
                    }
                }
                #endregion

                sql = uiFO.ReplaceString(sql, null, tabEmbeddedFields);

                #region 地址栏过滤
                DataTable dtTmpl = sqlHeler.ExecuteDataTable(string.Format("SELECT * FROM ({0}) T WHERE 1=2", sql));
                foreach (string key in Request.QueryString.Keys)
                {
                    if (string.IsNullOrEmpty(key))
                        continue;
                    if ("ID,FullID,FULLID,TmplCode,IsPreView,_winid,_t".Split(',').Contains(key) || key.StartsWith("$"))
                        continue;
                    if (dtTmpl.Columns.Contains(key))
                        qb.Add(key, QueryMethod.In, Request[key]); ;
                }
                #endregion

                GridData data = null;
                if (listDef.LayoutGrid.Contains("\"showPager\":\"false\""))
                {
                    qb.PageSize = 0;
                }
                data = sqlHeler.ExecuteGridData(sql, qb, listDef.OrderBy);

                #region 计算汇总
                StringBuilder sb = new StringBuilder();
                foreach (var field in fields)
                {
                    if (field.ContainsKey("Settings") == false)
                        continue;
                    var settings = JsonHelper.ToObject(field["Settings"].ToString());
                    if (settings.ContainsKey("Collect") == false || settings["Collect"].ToString() == "")
                        continue;
                    if (Config.Constant.IsOracleDb)
                        sb.AppendFormat(",{1}({0}) as {0}", field["field"], settings["Collect"]);
                    else
                        sb.AppendFormat(",{0}={1}({0})", field["field"], settings["Collect"]);

                    if (settings["Collect"].ToString() == "sum")
                        data.sumData.Add(field["field"].ToString(), null);
                    else
                        data.avgData.Add(field["field"].ToString(), null);
                }
                if (sb.Length > 0)
                {
                    string companyAuth = "";
                    if (System.Configuration.ConfigurationManager.AppSettings["CorpAuthEnabled"] == "True")
                    {
                        var dt = sqlHeler.ExecuteDataTable(string.Format("select * from ({0}) tempDt1 where 1=2", sql));
                        if (dt.Columns.Contains("CompanyID"))
                        {
                            companyAuth = string.Format(" and CompanyID='{0}'", FormulaHelper.GetUserInfo().UserCompanyID);
                        }
                    }

                    string collectSql = "";
                    SearchCondition authCnd = FormulaHelper.CreateAuthDataFilter();
                    collectSql = string.Format("select * from ({0}) sourceTable1 where 1=1 {1} {2}", sql, authCnd.GetWhereString(false), companyAuth);
                    collectSql = string.Format("select {2} from ({0}) sourceTable {1}", collectSql, qb.GetWhereString(), sb.ToString().Trim(','));
                    DataTable dtCollect = sqlHeler.ExecuteDataTable(collectSql);

                    foreach (DataColumn col in dtCollect.Columns)
                    {
                        if (data.sumData.ContainsKey(col.ColumnName))
                            data.sumData[col.ColumnName] = dtCollect.Rows[0][col] is DBNull ? 0 : dtCollect.Rows[0][col];
                        else
                            data.avgData[col.ColumnName] = dtCollect.Rows[0][col] is DBNull ? 0 : dtCollect.Rows[0][col];
                    }
                }

                //汇总数据小数点
                foreach (var field in fields)
                {
                    if (field.ContainsKey("Settings") == false)
                        continue;
                    var settings = JsonHelper.ToObject(field["Settings"].ToString());
                    if (settings.ContainsKey("Collect") == false || settings["Collect"].ToString() == "")
                        continue;
                    int decimalPlaces = 2;
                    if (settings.ContainsKey("decimalPlaces") && settings["decimalPlaces"].ToString() != "")
                        decimalPlaces = Convert.ToInt32(settings["decimalPlaces"]);

                    string fieldCode = field["field"].ToString();

                    if (data.sumData.ContainsKey(fieldCode))
                    {
                        data.sumData[fieldCode] = string.Format("{0:F" + decimalPlaces + "}", Convert.ToDouble(data.sumData[fieldCode]));
                    }
                    else
                    {
                        data.avgData[fieldCode] = string.Format("{0:F" + decimalPlaces + "}", Convert.ToDouble(data.avgData[fieldCode]));
                    }
                }

                #endregion

                return Json(data);
            }
        }
        #endregion
  
        */
    }
}
