using KAJ.Common.Helper;
using KAJ.CoreAuto.BaseFormula;
using KAJ.Model.Models;
using KAJ.Model.UI;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

namespace KAJ.CoreAuto.BaseAuto
{
    public class BaseAutoFormController : Controller
    {
        private readonly SQLHelper sqlHelper = SQLHelper.CreateSqlHelper();

        #region 页面初始化

        public virtual ActionResult CoreView()
        {
            try
            {
                string ID = Request.Query["ID"];
                string tmplCode = Request.Query["tmplCode"];
                string IsPreView = Request.Query["IsPreView"];
                string UpperVersion = Request.Query["UpperVersion"];

                //前台用的判断数据
                ViewBag.tmplCode = tmplCode;
                ViewBag.IsPreView = IsPreView;
                ViewBag.IsPreView = IsPreView;
                ViewBag.UpperVersion = UpperVersion;
                ViewBag.FlowCode = Request.Query["FlowCode"];
                ViewBag.TaskExecID = Request.Query["TaskExecID"];

                //TODO  流程升版
                UIBuilder uiFO = new UIBuilder();
                string sql = "SELECT  * FROM S_UI_Form WITH(NOLOCK) ";
                List<S_UI_Form> uiLists = SQLHelper.CreateSqlHelper().ExecuteList<S_UI_Form>(sql).Where(c => c.Code == tmplCode).ToList();
                S_UI_Form formDef = uiLists.FirstOrDefault();

                bool isNew = false;
                DataTable formDataDT = null;
                if (IsPreView == "True")
                {
                    formDataDT = new DataTable();
                    var row = formDataDT.NewRow();
                    formDataDT.Rows.Add(row);
                }
                else
                {
                    if (string.IsNullOrEmpty(UpperVersion))
                    {
                        sql = string.Format("select count(ID) from {0} where ID='{1}'", formDef.TableName, ID);
                        SQLHelper sqlHelper = SQLHelper.CreateSqlHelper(formDef.ConnName);
                        var count = Convert.ToInt32(sqlHelper.ExecuteScalar(sql));
                        if (count == 0)
                        {
                            isNew = true;
                        }
                        formDataDT = GetModelDT(formDef, ID);
                    }
                    else
                    {
                        isNew = true;
                        formDataDT = GetModelDT(formDef, UpperVersion, true);
                        formDataDT.Rows[0]["ID"] = GuidHelper.CreateGuid();
                        formDataDT.Rows[0]["FlowPhase"] = "";
                        formDataDT.Rows[0]["VersionNumber"] = "";
                    }
                    //TODO Import AfterGetData(formDataDT, isNew, UpperVersion);
                }
                ViewBag.FormData = JsonHelper.ToJson(formDataDT).Trim('[', ']');
                var fieldInfo = JsonHelper.ToJson(uiFO.GetFieldInfo(formDef));
                if (fieldInfo == "[]" || fieldInfo == "")
                    ViewBag.FieldInfo = "{}";
                else
                    ViewBag.FieldInfo = fieldInfo.Trim('[', ']');

                ViewBag.FormHtml = uiFO.CreateFormHtml(formDef);
                ViewBag.HiddenHtml = uiFO.CreateFormHiddenHtml(formDef);
                //此处允许开发者在自定义的controller中增加自己需要的脚本，同平台的脚本一起绘制在PageView中
                if (ViewBag.Script != null && !String.IsNullOrEmpty(ViewBag.Script))
                {
                    ViewBag.Script += "\n " + uiFO.CreateFormScript(formDef);
                }
                else
                {
                    ViewBag.Script = uiFO.CreateFormScript(formDef);
                }

                #region 子表大数据时，需要配置表单虚滚动加载
                var items = JsonHelper.ToObject<List<FormItem>>(formDef.Items);
                ViewBag.VirtualScroll = false.ToString().ToLower();
                var subTableList = items.Where(c => c.ItemType == "SubTable").ToList();
                foreach (var subTableItem in subTableList)
                {
                    if (String.IsNullOrEmpty(subTableItem.Settings)) continue;
                    var dic = JsonHelper.ToObject(subTableItem.Settings);
                    var dicSubTableSettings = JsonHelper.ToObject(dic["formData"].ToString());
                    if (dicSubTableSettings.GetValue("IsVirtualScroll") == "true")
                    {
                        ViewBag.VirtualScroll = true.ToString().ToLower();
                        break;
                    }
                }
                #endregion

                if (ViewBag.DataSource == null)
                {
                    var defaultValueRows = uiFO.GetDefaultValueDic(formDef.DefaultValueSettings);

                    #region 数据源到前台
                    StringBuilder sb = new StringBuilder();
                    foreach (var key in defaultValueRows.Keys)
                    {
                        var guid = new Guid();
                        if (Guid.TryParse(key, out guid) == false)
                            sb.AppendFormat("\n var {0}={1}", key, JsonHelper.ToJson(defaultValueRows[key]));
                    }
                    ViewBag.DataSource = sb.ToString();
                    #endregion
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return View();
        }


        #region 获取表单数据

        public DataTable GetModelDT(S_UI_Form formInfo, string id, bool isUpVersion = false, string taskExecID = "", string code = "")
        {
            UIBuilder uiFO = new UIBuilder();
            SQLHelper sqlHelper = SQLHelper.CreateSqlHelper(formInfo.ConnName);

            var items = JsonHelper.ToObject<List<FormItem>>(formInfo.Items);
            string sql = string.Format("select * from {0} where ID='{1}'", formInfo.TableName, id);
            DataTable dt = sqlHelper.ExecuteDataTable(sql);

            //获取数据后处理加密字段
            if (System.Configuration.ConfigurationManager.AppSettings["FieldEncryption"] == "True")
            {
                foreach (var item in items)
                {
                    if (item.FieldType == "varbinary(500)")
                    {
                        string _sql = @"
OPEN SYMMETRIC KEY SymmetricByCert
DECRYPTION BY CERTIFICATE JinHuiCertificate 
";
                        _sql += string.Format("select convert(nvarchar(500), DecryptByKey({1})) from {0} where ID='{2}'", formInfo.TableName, item.Code, id);
                        var obj = sqlHelper.ExecuteScalar(_sql);
                        if (dt.Rows.Count > 0)
                        {
                            dt.Columns.Remove(item.Code);
                            dt.Columns.Add(item.Code);
                            dt.Rows[0][item.Code] = obj.ToString();
                        }
                    }
                }
            }
            Dictionary<string, DataTable> defaultValueRows = null;
            if (dt.Rows.Count == 0)
                defaultValueRows = uiFO.GetDefaultValueDic(formInfo.DefaultValueSettings);
            else
                defaultValueRows = uiFO.GetDefaultValueDic(formInfo.DefaultValueSettings, dt.Rows[0]);

            #region 数据默认值
            StringBuilder sb = new StringBuilder();
            foreach (var key in defaultValueRows.Keys)
            {
                var guid = new Guid();
                if (Guid.TryParse(key, out guid) == false)
                    sb.AppendFormat("\n var {0}={1}", key, JsonHelper.ToJson(defaultValueRows[key]));
            }
            ViewBag.DataSource = sb.ToString();
            #endregion

            if (dt.Rows.Count == 0 || isUpVersion)
            {
                #region 新对象默认值

                DataRow row = null;
                if (dt.Rows.Count == 0)
                {
                    row = dt.NewRow();
                    dt.Rows.Add(row);
                }
                else
                    row = dt.Rows[0];

                row["ID"] = string.IsNullOrEmpty(id) ? GuidHelper.CreateGuid() : id;

                //包含默认值设置则初始化默认值
                items.Where(c => !string.IsNullOrEmpty(c.DefaultValue)).ToList().ForEach(d =>
                {
                    if (d.ItemType == "SubTable")
                    {
                        //子表
                        if (!dt.Columns.Contains(d.Code))
                            dt.Columns.Add(d.Code);

                        row[d.Code] = uiFO.GetDefaultValue(d.Code, d.DefaultValue, defaultValueRows);
                    }
                    else if (!dt.Columns.Contains(d.Code))
                        return;
                    else if ((d.ItemType == "ButtonEdit" || d.ItemType == "ComboBox") && d.DefaultValue.Split(',').Count() == 2)
                    {
                        //键值控件
                        string v1 = uiFO.GetDefaultValue(d.Code, d.DefaultValue.Split(',')[0], defaultValueRows);
                        string v2 = uiFO.GetDefaultValue(d.Code, d.DefaultValue.Split(',')[1], defaultValueRows);
                        if (!string.IsNullOrEmpty(v1) && v1.Contains('{') == false)
                            row[d.Code] = v1;
                        if (!string.IsNullOrEmpty(v2) && v2.Contains('{') == false)
                        {
                            var fieldName = "";
                            fieldName = d.Code + "Name";
                            if (!String.IsNullOrWhiteSpace(d.Settings))
                            {
                                var settings = JsonHelper.ToObject(d.Settings);
                                var txtName = settings.GetValue("textName");
                                if (!String.IsNullOrEmpty(txtName))
                                {
                                    fieldName = txtName;
                                }
                            }
                            row[fieldName] = v2;
                        }
                    }
                    else
                    {
                        //单值控件
                        string v = uiFO.GetDefaultValue(d.Code, d.DefaultValue, defaultValueRows);
                        if (!string.IsNullOrEmpty(v) && v.Contains('{') == false)
                            row[d.Code] = v;
                    }
                });

                #endregion

                #region 升版子表无默认值数据取历史版本
                foreach (var item in items)
                {
                    if (item.ItemType != "SubTable")
                        continue;

                    if (!dt.Columns.Contains(item.Code))
                        dt.Columns.Add(item.Code);
                    if (!string.IsNullOrEmpty(Convert.ToString(dt.Rows[0][item.Code])))
                    {
                        sql = string.Format("select * from {0}_{1} where {0}ID='{2}' order by SortIndex", formInfo.TableName, item.Code, id);
                        DataTable dtSubTable = sqlHelper.ExecuteDataTable(sql);
                        if (dtSubTable.Rows.Count > 0)
                            dt.Rows[0][item.Code] = JsonHelper.ToJson(dtSubTable);
                    }
                }

                #endregion

                //设置默认流水号
                if (dt.Columns.Contains("SerialNumber") && !string.IsNullOrEmpty(formInfo.SerialNumberSettings) && !isUpVersion)
                {
                    var serialNumberDic = JsonHelper.ToObject(formInfo.SerialNumberSettings);
                    string userMode = "ONLYGET";//默认值兼容老项目没有配置该选项
                    if (serialNumberDic.ContainsKey("UserSerialNumber"))
                        userMode = serialNumberDic["UserSerialNumber"] == null ? "" : serialNumberDic["UserSerialNumber"].ToString().Trim().ToUpper();

                    if (userMode != "NONE" && userMode != "FLOWEND")
                    {
                        bool isAutoIncrease = userMode.Equals("ONLYGET");

                        row["SerialNumber"] = GetSerialNumber(formInfo.Code, formInfo.SerialNumberSettings, isAutoIncrease, row, null);
                    }
                }
            }
            else //获取子表数据
            {
                #region 获取子表数据
                foreach (var item in items)
                {
                    if (item.ItemType != "SubTable")
                        continue;

                    //表单子表支持加密字段
                    if (System.Configuration.ConfigurationManager.AppSettings["FieldEncryption"] == "True")
                    {
                        var subTableSettings = JsonHelper.ToObject(item.Settings);
                        var subTableItems = JsonHelper.ToObject<List<FormItem>>(subTableSettings["listData"].ToString());
                        StringBuilder sbSubTableFields = new StringBuilder();
                        sbSubTableFields.AppendFormat("ID");
                        foreach (var subItem in subTableItems)
                        {
                            if (subItem.FieldType == "")
                            {
                            }
                            else if (subItem.FieldType == "varbinary(500)")
                            {
                                sbSubTableFields.AppendFormat(",{0}=convert(nvarchar(500), DecryptByKey({0})) ", subItem.Code);
                            }
                            else
                            {
                                sbSubTableFields.Append("," + subItem.Code);
                            }

                            if (subItem.ItemType == "ButtonEdit")
                            {
                                sbSubTableFields.Append("," + subItem.Code + "Name");
                            }
                            else if (subItem.ItemType == "ComboBox" && !String.IsNullOrEmpty(subItem.Settings))
                            {
                                var subSetting = JsonHelper.ToObject(subItem.Settings);
                                if (!String.IsNullOrEmpty(subSetting.GetValue("textName")))
                                    sbSubTableFields.Append("," + subSetting.GetValue("textName"));
                            }
                        }

                        sql = string.Format("select {3} from {0}_{1} where {0}ID='{2}' order by SortIndex", formInfo.TableName, item.Code, id, sbSubTableFields);

                        //子表支持加密
                        if (System.Configuration.ConfigurationManager.AppSettings["FieldEncryption"] == "True")
                        {
                            sql = @"
OPEN SYMMETRIC KEY SymmetricByCert
DECRYPTION BY CERTIFICATE JinHuiCertificate 
" + sql;
                        }
                    }
                    else
                    {
                        sql = string.Format("select * from {0}_{1} where {0}ID='{2}' order by SortIndex", formInfo.TableName, item.Code, id);
                    }



                    DataTable dtSubTable = sqlHelper.ExecuteDataTable(sql);

                    if (!dt.Columns.Contains(item.Code))
                        dt.Columns.Add(item.Code);
                    dt.Rows[0][item.Code] = JsonHelper.ToJson(dtSubTable);
                }

                #endregion
            }

            //计算值(增加表单表没有的字段) 2015-6-16 新增功能
            foreach (var item in items)
            {
                if (dt.Columns.Contains(item.Code))
                    continue;
                if (string.IsNullOrEmpty(item.DefaultValue))
                    continue;

                dt.Columns.Add(item.Code);

                string v = uiFO.GetDefaultValue(item.Code, item.DefaultValue, defaultValueRows);
                if (!string.IsNullOrEmpty(v) && v.Contains('{') == false)
                    dt.Rows[0][item.Code] = v;
            }

            return dt;
        }


        protected string GetSerialNumber(string formCode, string SerialNumberSettings, bool applySerialNumber, DataRow row = null, Dictionary<string, string> dic = null)
        {
            UIBuilder uiFO = new UIBuilder();
            var serialNumberDic = JsonHelper.ToObject(SerialNumberSettings);
            string tmpl = serialNumberDic["Tmpl"].ToString();
            string resetRule = serialNumberDic["ResetRule"].ToString();
            string CategoryCode = "";
            string SubCategoryCode = "";
            string OrderNumCode = "";
            string PrjCode = "";
            string OrgCode = "";
            string UserCode = "";

            if (serialNumberDic.ContainsKey("CategoryCode"))
                CategoryCode = uiFO.ReplaceString(serialNumberDic["CategoryCode"].ToString(), row, dic);
            if (serialNumberDic.ContainsKey("SubCategoryCode"))
                SubCategoryCode = uiFO.ReplaceString(serialNumberDic["SubCategoryCode"].ToString(), row, dic);
            if (serialNumberDic.ContainsKey("OrderNumCode"))
                OrderNumCode = uiFO.ReplaceString(serialNumberDic["OrderNumCode"].ToString(), row, dic);
            if (serialNumberDic.ContainsKey("PrjCode"))
                PrjCode = uiFO.ReplaceString(serialNumberDic["PrjCode"].ToString(), row, dic);
            if (serialNumberDic.ContainsKey("OrgCode"))
                OrgCode = uiFO.ReplaceString(serialNumberDic["OrgCode"].ToString(), row, dic);
            if (serialNumberDic.ContainsKey("UserCode"))
                UserCode = uiFO.ReplaceString(serialNumberDic["UserCode"].ToString(), row, dic);

            SerialNumberParam param = new SerialNumberParam()
            {
                Code = formCode,
                PrjCode = PrjCode,
                OrgCode = OrgCode,
                UserCode = UserCode,
                CategoryCode = CategoryCode,
                SubCategoryCode = SubCategoryCode,
                OrderNumCode = OrderNumCode
            };

            string SerialNumber = SerialNumberHelper.GetSerialNumberString(tmpl, param, resetRule, applySerialNumber);

            return SerialNumber;
        }


        #endregion

    }
    #endregion
}
