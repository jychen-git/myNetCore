
//说明：
//  0、必须熟练掌握接口
//  1、setting参数可以省略
//  2、on开头方法为事件方法
/*---------------------------------------------------------基本方法开始--------------------------------------------------------*/
//  addExecuteParam(key, value);
//  execute(action, execSettings);
//  openWindow(url, windowSettings);
//  closeWindow(data);
//  showWindow(windowId);
//  hideWindow(windowId);
//  getQueryString(key);
//  hasQueryString(key);
//  getValues(rows, attr);
/*---------------------------------------------------------基本方法结束--------------------------------------------------------*/
/*---------------------------------------------------------DataGrid开始--------------------------------------------------------*/
//  onDrawSummaryCell
//  addGridEnum(gridId, fieldName, enumKey);
//  addGridLink(gridId, fieldName, url, gridLinkSettings);
//  addGridButton(gridId, fieldName, gridButtonSettings)
/*---------------------------------------------------------DataGrid结束--------------------------------------------------------*/
/*---------------------------------------------------------选择器开始--------------------------------------------------------*/
//  addSelector(name, url, selectorSettings);
//  addEnumSelector(name, enumKey, selectorSettings);
/*---------------------------------------------------------选择器结束--------------------------------------------------------*/
/*---------------------------------------------------------其它开始--------------------------------------------------------*/
//  setFormDisabled(normalSettings);
//  setFormItemDisabled(name);
//  setFormItemEditabled(name);
//  destroyIframeMemory(iframe);
//  replaceUrl(url, windowSetting);
/*---------------------------------------------------------其它结束--------------------------------------------------------*/

/*------------------------------------------通用工具类方法 开始----------------------------------------------------------------
formatCurrency（num） 格式化金额，输入1234.56，输出￥1234.56
--------------------------------------------通用工具类方法 结束--------------------------------------------------------------*/


/*---------------------------------------------------------全局变量开始--------------------------------------------------------*/
if (typeof alertTitleStr == "undefined")
    alertTitleStr = "XXX建筑设计研究院";//消息弹出框

// 不启用MiniUI的debugger
mini_debugger = false;

//跨页多选
var selectMaps = {};

//基本参数配置
var normalParamSettings = {
    key: "",                     //配置的key,用户从配置数组中查找
    formId: "dataForm",
    gridId: "dataGrid",         //执行关联的gridId
    treeId: "dataTree",         //执行关联的TreeId
    queryFormId: "queryForm",
    queryWindowId: "queryWindow",
    queryBoxId: "key",
    queryTreeBoxId: "treeKey",
    refresh: true,                  //是否刷新  
    paramFrom: "",          //action或url从哪个控件获取参数值
    validateForm: true,     //验证表单输入
    fullRelation: false,    //停止使用
    nodeFullID: "",         //停止使用
    relationData: ""        //停止使用 
};

//操作参数配置
var operateParamSettings = {
    mustConfirm: false,                 //执行前是否需要用户确认
    mustSelectRow: false,                     //必须选择行
    mustSelectRowMsg: "当前没有选择要操作的记录，请重新确认！",         //必须选择的提示信息的提示信息
    mustSelectOneRow: false,
    mustSelectOneRowMsg: "需要选择一条操作记录，请重新确认！",
    mustSelectNode: false,                    //必须选择节点
    mustSelectNodeMsg: "当前没有选择要操作的节点，请重新确认！",        //必须选择的提示信息的提示信息
    mustSelectLeafNode: false,
    mustSelectLeafNodeMsg: "当前没有选择叶子节点，请重新确认！",
    mustSelectNavGridOneRowMsg: "需要选择一条导航记录，请重新确认！"
};

//execute方法参数配置，继承自基本参数配置和操作参数配置
var executeParamSettings = {
    resetFormData: true,     //根据返回值重置表单数据
    showLoading: true,
    loadingInterval: 5,
    async: true,
    action: "",
    execParams: new Object(), //执行参数
    onComplete: null,         //执行完成后调用的方法
    onBeforeExecute: null,   //执行前调用的方法
    onFail: null,         //执行失败后调用的方法
    actionTitle: "",          //可以为保存、删除等    
    loadingMessageId: "",     //loading窗口消息Id
    addQueryString: true,
    closeWindow: false        //执行成功后是否关闭窗口
};
executeParamSettings = jQuery.extend(true, {}, normalParamSettings, operateParamSettings, executeParamSettings);

//窗口参数配置，继承自基本参数配置和操作单数配置
var windowParamSettings = {
    url: "",
    allowResize: true,
    onDestroy: null,           //销毁时调用
    onLoad: null,              //加载完成时调用页面方法参数为contentWindow
    getDataAction: "",
    title: "",                 //窗口标题
    width: '80%',                //窗口宽度
    height: '80%',               //窗口高度
    addQueryString: true,
    showMaxButton: true,
    funcType: ""               //地址栏FuncType
};
windowParamSettings = jQuery.extend(true, {}, normalParamSettings, executeParamSettings, operateParamSettings, windowParamSettings);


//Grid连接参数配置，继承自窗口参数
var gridLinkParamSettings = {
    currentRow: null,    //当前行
    onFilter: null,     //过滤条件函数
    refresh: false,     //关闭后是否刷新grid   
    linkText: "",       //连接文本，默认为当前字段值
    isButton: false,    //是否显示为按钮
    paramField: "ID",   //执行参数字段 
    url: ""             //窗口Url
};
gridLinkParamSettings = jQuery.extend(true, {}, windowParamSettings, gridLinkParamSettings);

//Grid按钮参数配置，继承自执行参数
var gridButtonParamSettings = {
    onFilter: null,           //过滤条件函数
    onButtonClick: null,      //点击按钮执行方法
    linkText: "",             //连接文本，默认为当前字段值
    isButton: false,          //是否显示为按钮
    paramField: "ID",         //执行参数字段 
    mustConfirm: true         //是否需要用户确认
};
gridButtonParamSettings = jQuery.extend(true, {}, executeParamSettings, gridButtonParamSettings);


//选择器参数配置，集成自窗口参数
var selectorParamSettings = {
    name: "",                              //选择器的名字
    title: "请选择",                       //窗口标题   
    url: "/Base/Selector/List",            //选择窗口的Url
    autoCompleteAction: "AutoComplete",    //智能感知Action，尚未实现
    enumKey: "",                           //枚举Key    
    selectMode: "single",                  //选择模式单选还是多选，多选为multi
    onSelected: onSelected,                       //选择完成的回调方法
    returnParams: "value:ID,text:Name",    //返回值处理格式，如value:ID,text:Name
    existValidateFields: "",               //Grid记录存在验证，与returnParams格式相同
    targetType: "form",                    //返回值目标还可以是grid和row
    isAppend: false                        //是否追加模式，功能尚未实现
};
selectorParamSettings = jQuery.extend(true, {}, windowParamSettings, selectorParamSettings);


var instantSave = true; //是否即时保存

/*---------------------------------------------------------全局变量结束--------------------------------------------------------*/

/*---------------------------------------------------------基本方法开始--------------------------------------------------------*/

var executeParamKeys = new Array();
var executeParamValues = new Array();
function addExecuteParam(key, value) {
    if (typeof (value) == "object" || typeof (value) == "array" || value.constructor == Array || value.constructor == Object)
        value = mini.encode(value);
    executeParamKeys.push(key);
    executeParamValues.push(value);
}

//异步调用action
function execute(action, execSettings) {
    var url = changeToFullUrl(action); //url转化为全路径   
    return executeUrl(url, execSettings);
}

function executeUrl(url, execSettings) {

    var settings = jQuery.extend(true, {}, executeParamSettings, execSettings);

    if (settings.showLoading) {  //遮蔽罩
        showLoading(settings.loadingInterval);//loadingInterval默认为10，即每秒前进10%
    }

    //将url中的{}参数替换掉
    url = replaceUrl(url, settings);

    //验证输入
    if (!validateInput(settings)) {
        hideLoading();
        if (errorTexts.length > 0 && typeof (showErrors) != "undefined" && showErrors) {
            var s = "";
            for (var i = 0; i < errorTexts.length; i++) {
                s += "<div style='text-align:left'>" + errorTexts[i] + "</div>";
            }
            msgUI(s);
        }
        else {
            msgUI("当前输入的信息有误，请重新检查！", 1);
        }
        return;
    }
    //用户操作验证，如验证必须选中一行列表数据等
    if (!validateOperation(settings)) {
        hideLoading();
        return;
    }

    //验证特殊处理
    if (settings.mustConfirm) {
        hideLoading();
        msgUI("确认" + settings.actionTitle + "吗？", 2, _confirmBackFunc);
    }
    else
        return _confirmBackFunc("ok");


    function _confirmBackFunc(action) {
        if (action == "ok") {

            if (settings.showLoading) {  //遮蔽罩
                showLoading(settings.loadingInterval);
            }

            //获取执行参数
            var executeParams = getExecuteParams(settings);
            if (settings.addQueryString)
                url = addUrlSearch(url, executeParams); //url增加当前地址栏参数

            if (settings.onBeforeExecute) {
                var result = settings.onBeforeExecute(executeParams, action, url);
                if (!result) {
                    return;
                }
            }
            //异步执行
            return jQuery.ajax({
                url: url,
                type: "post",
                data: executeParams,
                cache: false,
                async: settings.async,
                success: function (text, textStatus) {
                    hideLoading();

                    //增加新版报错分支
                    if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                        var fail = jQuery.parseJSON(text);
                        var msg = getErrorFromHtml(fail.errmsg);
                        if (msg) {
                            msgUI(msg, 4, function (act) {
                                if (settings.onFail)
                                    settings.onFail(msg, settings);
                            });
                        }
                        else {
                            if (settings.onFail)
                                settings.onFail(msg, settings);
                        }
                        return;
                    }
                    else {
                        window.refreshList = true; //解决暂存后，点X关闭页面后不刷列表的问题
                        //弹出消息                    
                        if (settings.actionTitle.length > 0 && !settings.onComplete) {

                            msgUI(settings.actionTitle + "成功！", 0, _callBackFunc);
                        }
                        else {
                            _callBackFunc();
                        }
                    }


                    function _callBackFunc(act) {
                        var json;

                        try {
                            if (text) {
                                json = mini.decode(text);
                                //formData = json;
                            }
                        }
                        catch (e) {
                            if (settings.onComplete)
                                settings.onComplete(text, settings);
                            else if (settings.closeWindow)
                                closeWindow();
                            return;
                        }

                        //刷新表单控件
                        if (settings.resetFormData) {
                            for (var key in json) {
                                var item = mini.getbyName(key);
                                if (item != undefined) {
                                    item.setValue(json[key]);
                                    //解决combobox控件BUG
                                    if (item.type == "combobox")
                                        if (item.getText() == "")
                                            item.setText(json[key]);
                                }
                            }
                        }
                        //刷新Grid
                        if (settings.refresh && !settings.onComplete) {
                            if (settings.gridId != "") {
                                var grid = mini.get(settings.gridId);
                                if (grid != undefined && grid.url) {
                                    grid.setUrl(addUrlSearch(grid.url));
                                    grid.reload();
                                }
                            }
                        }
                        if (settings.onComplete)
                            settings.onComplete(json, settings);
                        else if (settings.closeWindow)
                            closeWindow("refresh");


                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    //保留：兼容旧版2019-5-22
                    var msg = getErrorFromHtml(jqXHR.responseText);
                    //c_hua 2018-2-8 当请求cancel，msg为空，此时不弹出提示
                    if (msg) {
                        msgUI(msg, 4, function (act) {
                            hideLoading();
                            if (settings.onFail)
                                settings.onFail(msg, settings);
                        });
                    }
                    else {
                        hideLoading();
                        if (settings.onFail)
                            settings.onFail(msg, settings);
                    }
                }
            });
        }
    }



}

function openWindow(url, windowSettings) {

    if (typeof (url) == "undefined") {
        msgUI('当前url不能为空，请检查！', 4);
        return;
    }

    var settings = jQuery.extend(true, {}, windowParamSettings, windowSettings);

    //用户操作验证，如验证必须选中一行列表数据等
    if (!validateOperation(settings))
        return;

    //将url中的{}参数替换掉
    url = replaceUrl(url, settings);
    //转化为全路径
    url = changeToFullUrl(url);

    if (settings.addQueryString) {
        //url增加当前地址栏参数
        url = addUrlSearch(url);
    }

    var title = replaceUrl(settings.title, settings);
    title = title.split('?')[0]; //移除replaceUrl可能附带的FuncType=View
    if (title.length > 20)
        title = title.substr(0, 20) + "...";

    //if (typeof (showHelpBtn) != "undefined" && showHelpBtn == true) { //此参数在MvcAdapter的GetBasicInfo方法中获取
    //    title += "&nbsp;&nbsp;<span style='cursor:help;' onclick='window.open(\"" + '/MvcConfig/UI/Help/PageView?Url=' + escape(window.location.pathname + window.location.search) + "\");'><img src='/CommonWebResource/Theme/Default/MiniUI/icons/help.gif'>帮助</img></span>";
    //}

    //去掉页面加载进来生成token，修改为顶部菜单和左侧菜单部分判断是否跨域，若跨域请求token，拼到url
	//if (typeof (tokenKey) != "undefined" && typeof (token) != "undefined" && tokenKey && token) {
    //    if (url.indexOf(tokenKey+"=") < 0) {
    //        if (url.indexOf("?") > 0) {
    //            url += "&" + tokenKey + "=" + token;
    //        }
    //        else {
    //            url += "?" + tokenKey + "=" + token;
    //        }
    //    }    
    //}
    settings.url = url;
    //打开窗口
    mini.open({
        url: url,
        title: title,
        allowDrag: true,
        allowResize: settings.allowResize,
        showModal: true,
        showMaxButton: settings.showMaxButton,
        width: settings.width,
        height: settings.height,
        onload: function () {
            var iframe = this.getIFrameEl();
            if (settings.onLoad) {
                settings.onLoad(iframe.contentWindow);
            }
            if (jQuery.trim(this.title)) {
                if (iframe.contentWindow && typeof (iframe.contentWindow.document) != "unknown")
                    jQuery(iframe.contentWindow.document).attr("title", this.title);
            }
            if (typeof (iframe.contentWindow.jQuery) != "undefined" && typeof (iframe.contentWindow.jQuery) != "unknown") {
                var $input = jQuery("<input>").attr("type", "hidden").attr("id", "mini_window_id").val(this.id);
                iframe.contentWindow.jQuery("body").append($input);
            }

            if (settings.data && iframe.contentWindow.setData)
                iframe.contentWindow.setData(settings.data);
            else if (settings.getDataAction != "") {
                var action = changeToFullUrl(settings.getDataAction);
                action = replaceUrl(action, settings);
                execute(action, {
                    refresh: false, onComplete: function (data, settings) {
                        if (typeof (iframe.contentWindow.setData) != "unknown")
                            iframe.contentWindow.setData(data); //将获取的数据设置到窗口
                    }
                });
            }
        },
        ondestroy: function (data) {
            if (data)
                data = mini.clone(data);
            var _refresh = settings.refresh;
            var iframe = this.getIFrameEl();
            if (data == "close") { //当点击的是关闭按钮时
                try { //防止跨域问题2017-3-30
                    if (iframe.contentWindow.refreshList) //执行过excute方法，则refreshList为true
                        _refresh = true;
                    else
                        _refresh = false;
                }
                catch (e) {
                    return;
                }
            }

            if (settings.onDestroy)
                settings.onDestroy(data, settings);
            else if (settings.action && data != "close") {
                addExecuteParam("RelationData", mini.encode(data));
                execute(settings.action, settings);
            }
            else if (_refresh || data == "refresh") {
                var grid = mini.get("#" + settings.gridId);
                if (grid != undefined && grid.url) {
                    grid.setUrl(addUrlSearch(grid.url));
                    grid.reload();
                }
            }
            //释放内存
            var iframe = this.getIFrameEl();
            destroyIframeMemory(iframe);
        }
    });
}

function closeWindow(data) {
    setTimeout(function () {
        if (window.CloseOwnerWindow) return window.CloseOwnerWindow(data, true);
        else window.close();
    }, 10);
}

function showWindow(windowId) {
    var window = mini.get(windowId);
    if (!window) { msgUI("未找到指定的window窗体！", 4); return; }
    window.queryWindowId = windowId;
    window.show();
}

function showQueryWindow(btn, windowId) {
    var win = mini.get(windowId || 'queryWindow');
    if (!win) { msgUI("未找到指定的window窗体！", 4); return; }
    win.showAtEl(btn.el, {
        xAlign: "right",
        yAlign: "below"
    });
}

function hideWindow(windowId) {
    var window = mini.get(windowId);
    if (!window) { msgUI("未找到指定的window窗体！", 4); return; }
    window.hide();
}

//获取地址栏参数,如果参数不存在则返回空字符串
function getQueryString(key, url) {
    if (typeof (url) == "undefined")
        url = window.location.search;
    var re = new RegExp("[?&]" + key + "=([^\\&]*)", "i");
    var a = re.exec(url);
    if (a == null) return "";
    return a[1];
}

//判断是否包含地址栏参数
function hasQueryString(key, url) {
    if (typeof (url) == "undefined")
        url = window.location.search;

    var re = new RegExp("[?&]" + key + "=([^\\&]*)", "i");
    var a = re.exec(url);
    if (a == null) return false;
    return true;
}


//获取数组中对象的某个值，逗号分隔
function getValues(rows, attr) {
    var fieldValues = [];
    for (var i = 0; i < rows.length; i++) {
        if (rows[i] != null)
            fieldValues.push(rows[i][attr]);
    }
    return fieldValues.join(',');
}

/*---------------------------------------------------------基本方法结束--------------------------------------------------------*/

/*---------------------------------------------------------Grid 扩展开始--------------------------------------------------------*/

function onDrawSummaryCell(e) {
    var result = e.result;
    if (result.sumData && e.field) {
        if (result.sumData[e.field] != undefined) {
            e.cellHtml = "<div style='width: 100%; text-align: right;'>总计：" + result.sumData[e.field] + "</div>";
        }
        else if (result.avgData[e.field] != undefined) {
            e.cellHtml = "<div style='width: 100%; text-align: right;'>平均：" + result.avgData[e.field] + "</div>";
        }
        else {
            e.cellHtml = "";
        }
    }
}

function onEnumRender(e) {
    return getEnumText(e.sender.id + "." + e.field, e.value);
}

//获取枚举文本
function getEnumText(gridFieldID, enumValues) {

    if (enumValues == null)
        return "";

    var en = eval(gridEnums[gridFieldID]);
    if (en == undefined) {
        return enumValues;
    }

    var vals = [];
    if (enumValues.split)
        vals = enumValues.split(',');
    else
        vals[0] = enumValues.toString();

    for (var i = 0; i < vals.length; i++) {
        if (vals[i] == "")
            continue;
        for (var j = 0; j < en.length; j++) {
            //if (en[j]["value"] && en[j]["value"].toString() == vals[i]) {
            //    vals[i] = en[j]["text"];
            //}
            var enumValue = en[j]["value"].toString();
            if (enumValue.indexOf('{0}') > 0) {//连续化枚举                
                var date = new Date(vals[i]);
                if (date == "Invalid Date") {//日期型为UTC格式，需要特殊处理
                    var expression = enumValue.replace(new RegExp('{0}', 'gm'), vals[i]);
                    if (eval(expression)) {
                        vals[i] = en[j]["text"];
                        break;
                    }
                }
                else {
                    var expression = enumValue.replace(new RegExp('\\{0\\}', 'gm'), date.format("yyyy-MM-dd hh:mm:ss").toString());
                    if (eval(expression)) {
                        vals[i] = en[j]["text"];
                        break;
                    }
                }
            }
            else {
                if (enumValue == vals[i]) {
                    vals[i] = en[j]["text"];
                    break;
                }
            }
        }
    }

    return vals.join(',');
}

function addGridEnum(gridId, fieldName, enumKey) {

    gridEnums[gridId + "." + fieldName] = enumKey;

    jQuery("#" + gridId + " div[field='" + fieldName + "']").each(function (index) {
        jQueryitem = jQuery(this);
        jQueryitem.attr("renderer", "onEnumRender");
        //jQueryitem.attr("align", "center");
    });
}
var gridEnums = new Object();
function onLinkRender(e) {
    var key = e.sender.id + "." + e.field;
    var settings = getSettings(gridLinkSettingss, key);
    if (settings == undefined)
        return e.value;

    var url = settings.url.replace(/\{[0-9a-zA-Z_]*\}/g, function (field) {
        var key = field.substring(1, field.length - 1);

        //从当前行返回
        if (e.record[key])
            return e.record[key];

        //从地址栏返回
        if (hasQueryString(key)) {
            return getQueryString(key);
        }
    });

    //列表中待办处理TaskExecID
    if (settings.url.toUpperCase().indexOf('_TASK') >= 0) {
        $.ajax({
            url: "/Workflow/PushTaskSettings/GetTaskId?ID=" + e.record['ID'],
            type: "post",
            async: false,
            success: function (taskId) {
                url = url + "&TaskExecID=" + taskId;
            }
        });
    }

    //如果添加了枚举，那么翻译枚举
    if (gridEnums[key])
        e.value = getEnumText(key, e.value);

    if (settings.onFilter) {
        if (!settings.onFilter(e))
            return e.value;
    }

    //追加不传值默认查看
    if (settings.title == "" && settings.funcType == "view") settings.title = "查看";
    var text = "";
    var column = e.column;
    if (column != undefined && column.displayField != undefined)
        text = settings.linkText == "" ? (e.value == null ? "" : e.cellHtml) : settings.linkText;
    else
        text = settings.linkText == "" ? (e.value == null ? "" : e.value) : settings.linkText;
    var cls = settings.isButton == true ? 'class="mini-button"' : '';

    if (settings.isButton)
        text = "&nbsp;" + text + "&nbsp;";
    //按钮图片的样式
    if (settings.buttonClass != null && settings.buttonClass != "") {
        cls = '';
        text = '<span class=' + settings.buttonClass + ' style="width:16px;height:16px;overflow:hidden;margin:auto;text-align:center; display:block;cursor:pointer;"></span>';
    }
    var uid = e.record._uid;

    //为了保证货币格式的显示正确此处加判定
    if (column.dataType && column.dataType == "currency") {
        text = mini.formatNumber(text, "n");
    }

    //如果是数字格式，则判定是否为0，如果为0则灰色显示
    if (e.value != null && e.value != undefined && e.value != "" && column.dataType && column.dataType == "currency") {
        var reg = new RegExp("^[0-9]*$");
        if (reg.test(e.value)) {
            if (e.value <= 0) {
                e.cellStyle = "text-align:right; color:#c4c4c4";
                return text;
            }
        }
    }
    //如果是日期格式，格式化显示
    if (e.value instanceof Date) {
        var column = e.column;
        if (column != undefined) {
            if (column.dateFormat) {
                text = mini.formatDate(e.value, column.dateFormat);
            }
        }
    }
    var s = '<a ' + cls + 'href="javascript:void(0)" onclick="onGridLinkClick(' + uid + ',\'' + key + '\',\'' + url + '\');">' + text + '</a>';

    return s;
}

function onGridLinkClick(uid, key, url) {
    var settings = getSettings(gridLinkSettingss, key);
    if (settings == undefined)
        return;
    var grid = mini.get(settings.gridId);
    //var row = grid.getRow(index);  treeGrid控件会出现获取不到的情况，因此改为getbyUID方法
    var row = grid.getRowByUID(uid);
    grid.select(row); //选中行
    settings.currentRow = row;
    settings.execParams[settings.paramField] = row[settings.paramField];
    openWindow(url, settings);
}

function addGridLink(gridId, fieldName, url, gridLinkSettings) {

    var setting = jQuery.extend(true, {}, gridLinkParamSettings, { gridId: gridId }, gridLinkSettings);
    setting["key"] = gridId + "." + fieldName;
    setting["gridId"] = gridId;
    setting["url"] = url;
    if (!setting["title"] && setting["linkText"])
        setting["title"] = setting["linkText"];
    gridLinkSettingss.push(setting);

    jQuery("#" + gridId + " div[field='" + fieldName + "']").each(function (index) {
        var jQueryitem = jQuery(this);
        jQueryitem.attr("renderer", "onLinkRender");
        if (setting["linkText"] != "")
            jQueryitem.attr("align", "center");
    });
}
var gridLinkSettingss = new Array();


//Grid按钮列开始
function onButtonRender(e) {
    var key = e.sender.id + "." + e.field;
    var settings = getSettings(gridButtonSettingss, key);
    if (settings == undefined)
        return;

    //if (settings.onFilter) {
    //    if (!settings.onFilter(e))
    //        return;
    //}

    //如果添加了枚举，那么翻译枚举
    if (gridEnums[key])
        e.value = getEnumText(key, e.value);

    if (settings.onFilter) {
        if (!settings.onFilter(e))
            return e.value;
    }

    var column = e.column;
    var cls = "";
    var text = settings.linkText == "" ? getEnumText(key, e.value) : settings.linkText;
    if (settings.isButton == true) {
        cls = 'class="mini-button"';
        text = '&nbsp;' + text + '&nbsp;';
    }

    //按钮图片的样式
    if (settings.buttonClass != null && settings.buttonClass != "") {
        cls = '';
        text = '<span class=' + settings.buttonClass + ' style="width:16px;height:16px;overflow:hidden;margin:auto;text-align:center; display:block;cursor:pointer;"></span>';
    }

    //为了保证货币格式的显示正确此处加判定
    if (column.dataType && column.dataType == "currency") {
        text = mini.formatNumber(text, "n");
    }

    //如果是数字格式，则判定是否为0，如果为0则灰色显示
    if (e.value != null && e.value != undefined && e.value != "") {
        var reg = new RegExp("^[0-9]*$");
        if (reg.test(e.value)) {
            if (e.value <= 0) {
                e.cellStyle = "text-align:right; color:#c4c4c4";
                if (column.dataType && column.dataType == "currency")
                    return text;
                else
                    return e.value;
            }
        }
    }
    //如果是日期格式，格式化显示
    if (e.value instanceof Date) {
        if (column != undefined) {
            if (column.dateFormat) {
                text = mini.formatDate(e.value, column.dateFormat);
            }
        }
    }

    var s = '<a ' + cls + 'href="javascript:void(0);" onclick="onGridButtonClick(this,' + e.row._uid + ',\'' + key + '\',\'' + e.record[settings.paramField] + '\');">' + text + '</a>';

    return s;
}

function onGridButtonClick(sender, uid, key, execParam) {

    var settings = getSettings(gridButtonSettingss, key);
    if (settings == undefined)
        return;
    var grid = mini.get(settings.gridId);
    var row = grid.getRowByUID(uid);
    if (settings.onButtonClick != null) {

        if (typeof (settings.onButtonClick) == "string")
            eval(settings.onButtonClick);
        else
            settings.onButtonClick(row, settings, sender);
        return;
    }

    var url = settings.action.replace(/\{[0-9a-zA-Z_]*\}/g, function (field) {
        var key = field.substring(1, field.length - 1);

        //从当前行返回
        if (row[key])
            return row[key];

        //从地址栏返回
        if (hasQueryString(key)) {
            return getQueryString(key);
        }

    });

    addExecuteParam(settings.paramField, execParam);
    execute(url, settings);
}

function addGridButton(gridId, fieldName, gridButtonSettings) {

    var setting = jQuery.extend(true, {}, gridButtonParamSettings, { gridId: gridId }, gridButtonSettings);
    setting["key"] = gridId + "." + fieldName;

    if (setting["actionTitle"] != "" && setting["linkText"] == "")
        setting["linkText"] = setting["actionTitle"];
    else if (setting["linkText"] != "" && setting["actionTitle"] == "")
        setting["actionTitle"] = setting["linkText"];

    gridButtonSettingss.push(setting);

    jQuery("#" + gridId + " div[field='" + fieldName + "']").each(function (index) {
        var jQueryitem = jQuery(this);
        jQueryitem.attr("renderer", "onButtonRender");
        if (setting["actionTitle"] != "")
            jQueryitem.attr("align", "center");
    });

}

var gridButtonSettingss = new Array();

//------------Grid中的文件上传----------------------//

function addGridFile(gridId, fieldName, settings) {
    var setting = jQuery.extend(true, {}, settings);
    setting["key"] = gridId + "." + fieldName;
    gridFileSettingss.push(settings);
    jQuery("#" + gridId + " div[field='" + fieldName + "']").each(function (index) {
        var jQueryitem = jQuery(this);
        jQueryitem.attr("renderer", "onFileRender");
        var html = jQueryitem.html();
        jQueryitem.html(html + '<input property="editor" type="file" style="width: 100%;"  />');
    });
}
var gridFileSettingss = new Array();
function onuploadsuccess(e, data, response) { //此方法为swf上传完成    
    e.sender.setValue(e.serverData);
    e.sender.setText(e.file.name);
}

function onFileRender(e) {
    var html = e.cellHtml;
    if (!html || html == "html")
        html = e.record[e.field] ? getMiniFileName(e.record[e.field]) : "";
    else if (html == e.record[e.field])
        html =  getMiniFileName(e.record[e.field]);
    return "<a href=\"javascript:void(0);\" onclick=\"javascript:window.open('" + DownloadUrl + "?FileId=" + e.record[e.field] + "');\" >" + html + "</a>";
}

function onGridFileUpload(e) {
    var fileCtrl = {
        formField: true,
        title: "上传",
        width: 200,
        required: false, //是否必填
        readonly: false, //是否只读
        disabled: false, //是否禁用
        maximumupload: "", //上传的最大文件大小
        maxnumbertoupload: "1", //上传的最大文件数量
        filter: "", //上传的文件类型
        allowthumbnail: false, //是否缩略图
        src: "system", //所属系统模块
        uiCls: "mini-singlefile"
    };

    var txtID = mini.getbyName("ID");
    if (txtID && txtID.getValue)
        fileCtrl.RelateId = txtID.getValue(); //关联的业务ID

    var buttonEdit = e.sender;
    var SlUploadUrl = "/FileStore/SlUpload/Upload.aspx";
    mini.open({
        url: SlUploadUrl + "?value=FileIds&" + "FileMode=multi&IsLog=undefined&Filter=" + escape(fileCtrl.filter) + "&MaximumUpload=" + fileCtrl.maximumupload + "&MaxNumberToUpload=" + fileCtrl.maxnumbertoupload + "&AllowThumbnail=" + fileCtrl.allowthumbnail + "&RelateId=" + fileCtrl.RelateId + "&Src=" + fileCtrl.src,
        width: 500,
        height: 300,
        title: "单附件上传",
        ondestroy: function (rtnValue) {
            if (rtnValue.substring(0, 3) == "err") {
                alert(rtnValue);
            }
            else if (rtnValue == "close") {
            }
            else {
                buttonEdit.setValue($.trim(rtnValue));
                buttonEdit.setText(getMiniFileName(rtnValue));
            }
        }
    });
}
function getMiniFileName(fileName) {
    if (fileName) {
        var result = "";
        var fileArray = fileName.split('_');
        if (fileArray.length >= 2)
            result = fileName.substr(fileName.indexOf('_') + 1);
        else
            result = fileName;

        if (result.lastIndexOf('_') > result.lastIndexOf('.') && result.lastIndexOf('.') > -1) {
            return result.substr(0, result.lastIndexOf('_'));
        }
        else
            return result;
    }
    else
        return "";
}

function getMiniFileNames(fileIds) {
    var fileArray = fileIds.split(",");
    var fileNames = "";
    for (var i = 0; i < fileArray.length; i++) {
        fileNames += getMiniFileName(fileArray[i]) + ",";
    }
    if (fileNames.length > 0)
        fileNames = fileNames.substr(fileNames, fileNames.length - 1);
    return fileNames;
}

function onGridLoad(e) {
    if (e.sender.id != undefined) {
        var grid = mini.get(e.sender.id);
        var rows = selectMaps[grid.getPageIndex()];
        if (rows) grid.selects(rows);
    }
}
function onGridPreLoad(e) {
    if (e["result"])
    {
        if (e["result"]["errcode"] && e["result"]["errcode"] != 200) {
            msgUI("请求数据错误：" + e["result"]["errmsg"], 4);
            return;
        }
    }
}
function onSelectoinChanged(e) {
    if (e.sender.id != undefined) {
        var grid = mini.get(e.sender.id);
        var rows = grid.getSelecteds();
        selectMaps[grid.getPageIndex()] = rows;
    }
}

/*---------------------------------------------------------Grid 扩展结束--------------------------------------------------------*/

/*---------------------------------------------------------选择器开始--------------------------------------------------------*/
//选择器控件(buttonEdit点击触发)
function onSelecting(e) {
    //获取选择器设置
    var settings = getSettings(selectorSettingss, e.sender.name);
    if (settings == undefined)
        return;

    //url追加EnumKey参数
    var url = settings.url;
    if (settings.enumKey != "") {
        url += (url.indexOf('?') < 0 ? "?" : "&") + "EnumKey=" + settings.enumKey;
    }

    if (!settings.onSelected)
        settings.onSelected = onSelected;
    settings.onDestroy = settings.onSelected;
    var winSetting = jQuery.extend(true, {}, windowParamSettings, settings, { selectorId: e.sender.id, refresh: false });

    //grid的弹出选择增加CurrentRow
    if (winSetting.targetType == "row") {
        var selector = mini.get(winSetting.selectorId);
        var grid = mini.get(winSetting.gridId);
        var row = grid.getEditorOwnerRow(selector);
        winSetting.currentRow = row;
    }

    winSetting.data = getSelectedUsers(settings, e.sender); //选人页面已选值

    //打开窗口
    openWindow(url, winSetting);
}

//选择器窗口关闭触发
function onSelected(data, settings) {
    if (data == undefined || typeof (data) != "object" || typeof (data) == "undefined")
        return;

    //用返回值设置表单
    if (settings.targetType == "form") {
        getSettings(selectorSettingss, settings.name).data = data;
        if (data.length > 1) {
            //当选择结果返回的是多个记录的时候，才进行名称和值的校验，防止名称中出现逗号，而返回记录只有一条时候会出错
            //此处只能解决名称中有逗号但是只有一条返回记录的问题，多条返回记录名称中如果有逗号，还是会报异常
            getSettings(selectorSettingss, settings.name).multiRec = true;
        }
        var selector = mini.get(settings.selectorId);
        if (!selector)
            selector = mini.getbyName(settings.selectorId);

        //设置value和text
        if (selector.uiCls == "mini-buttonedit" || selector.uiCls == "mini-linkedit") {
            var arrReturnParam = settings.returnParams.split(',');
            for (var i = 0; i < arrReturnParam.length; i++) {
                var field = arrReturnParam[i].split(':')[0];
                if (field == "value")
                    selector.setValue(getValues(data, arrReturnParam[i].split(':')[1]));
                else if (field == "text")
                    selector.setText(getValues(data, arrReturnParam[i].split(':')[1]));
            }
        }

        //处理returnParams
        var params = settings.returnParams.split(',');
        var alreadyField = {}; //已经赋值Value的字段
        for (var i = 0; i < params.length; i++) {
            var field = params[i].split(':')[0];
            var relateField = params[i].split(':')[1];

            if (field == "value" || field == "text" || $.trim(field) == "")
                continue;

            var item = mini.getbyName(field);
            if (item == undefined) {
                msgUI(settings.key + "控件的returnParams配置错误！无法找到控件：" + field, 4);
                return;
            }
            if (alreadyField[field] == true) //已经SetValue，则SetText
                item.setText(getValues(data, relateField));
            else
                item.setValue(getValues(data, relateField));
            alreadyField[field] = true;
        }

        //触发控件的onUserSelectChanged
        if (typeof (settings.onUserSelectChanged) != "undefined")
            settings.onUserSelectChanged(selector);
        //触发valueChanged
        if (selector.doValueChanged) {
            selector.doValueChanged();
        }
        if (selector.validate) {
            selector.validate();
        }
    }
    //用返回值设置Grid
    else if (settings.targetType == "grid") {
        var grid = mini.get(settings.gridId);

        for (var i = data.length - 1; i >= 0; i--) {
            var hasRow = false;
            if (settings.existValidateFields == "")
                hasRow = false;
            else {
                hasRow = grid.findRows(function (row) {
                    var roles = settings.existValidateFields.split(',');
                    var eq = true;
                    for (var j = 0; j < roles.length; j++) {
                        var srcField = roles[j].split(':')[0];
                        var destField = roles[j].split(':')[1];

                        if (data[i][destField] != row[srcField]) {
                            eq = false;
                            break;
                        }
                    }
                    if (eq == true)
                        return true;
                    else
                        return false;


                }).length > 0;
            }

            if (!hasRow) {

                var newRow = {};
                var arrReturnParam = settings.returnParams.split(',');
                for (var j = 0; j < arrReturnParam.length; j++) {
                    newRow[arrReturnParam[j].split(':')[0]] = data[i][arrReturnParam[j].split(':')[1]];
                }
                grid.addRow(newRow, 0);
            }
        }
    }
    else if (settings.targetType == "row") {
        var selector = mini.get(settings.selectorId);
        if (!selector)
            selector = mini.getbyName(settings.selectorId);
        var grid = mini.get(settings.gridId);
        var row = grid.getEditorOwnerRow(selector);
        var col = _getGridEditCol(grid.columns, selector);

        //修复子表丢失userid错误2019-11-8
        if (!settings.data)
            settings.data = {};
        settings.data[row["_uid"]] = data;

        function _getGridEditCol(columns, selector) {
            var col = null;
            if (columns != null && columns.length > 0) {
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].editor == selector) {
                        col = columns[i];
                        return col;
                    }
                    else {
                        col = _getGridEditCol(columns[i].columns, selector);
                        if (col != null)
                            return col;
                    }
                }
            }
            return col;
        }

        var autoCancelEdit = true;
        if (col == null) {//单行触发后编辑无法找到editor
            col = _getGridFileCol(grid.columns, selector.name);
            if (col != null) {
                autoCancelEdit = false;
            }
        }
        grid.commitEditRow(row);
        var newRow = row;

        //根据field获取列
        function _getGridFileCol(columns, field) {
            var col = null;
            if (columns != null && columns.length > 0) {
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].field == field) {
                        col = columns[i];
                        return col;
                    }
                    else {
                        col = _getGridFileCol(columns[i].columns, field);
                        if (col != null)
                            return col;
                    }
                }
            }
            return col;
        }

        var arrReturnParam = settings.returnParams.split(',');
        for (var j = 0; j < arrReturnParam.length; j++) {
            if (arrReturnParam[j] == "")
                continue;
            if (arrReturnParam[j].split(':')[0] == "value") {
                var s = getValues(data, arrReturnParam[j].split(':')[1]);
                selector.setValue(s);
                newRow[col["field"]] = s;
            }
            else if (arrReturnParam[j].split(':')[0] == "text") {
                var s = getValues(data, arrReturnParam[j].split(':')[1]);
                selector.setText(s);
                newRow[col["displayField"]] = s;
            }
            else {
                var s = getValues(data, arrReturnParam[j].split(':')[1]);
                var date = new Date(s);
                if (date == "Invalid Date" || isNaN(date))
                    newRow[arrReturnParam[j].split(':')[0]] = s;
                else {
                    var valueCol = _getGridFileCol(grid.columns, arrReturnParam[j].split(':')[0]);
                    if (valueCol != null && valueCol.dateFormat != null)
                        newRow[arrReturnParam[j].split(':')[0]] = date.format(valueCol.dateFormat);
                    else
                        newRow[arrReturnParam[j].split(':')[0]] = s;
                }
            }
        }
        if (newRow["_state"] == null) //解决状态丢失问题
            newRow["_state"] = "modified";
        grid.updateRow(row, newRow);
        if (autoCancelEdit) {
        }
        else {
            grid.beginEditRow(row);
        }
    }
}

function addSelector(name, url, selectorSettings) {
    jQuery("input[name='" + name + "']").each(function (index) {
        jQuery(this).attr("onbuttonclick", "onSelecting");
        //如果选择器在grid内部，则修改参数gridId和targetType
        if (index == 0) {
            var grid = $(this).closest(".mini-datagrid");
            if (grid.length > 0) {
                selectorSettings.gridId = grid[0].id;
                selectorSettings.targetType = "row";
            }
            grid = $(this).closest(".mini-treegrid");
            if (grid.length > 0) {
                selectorSettings.gridId = grid[0].id;
                selectorSettings.targetType = "row";
            }
        }
    }
    );
    var settings = jQuery.extend(true, {}, selectorParamSettings, selectorSettings, { name: name, key: name, url: url, addQueryString: false });
    selectorSettingss.push(settings);
}

var selectorSettingss = new Array();

//2017-6-9 新增 处理动态调整选择器url及参数
//如资质选人变化：SetSelectorURL("ReceiverIDs", null, { Aptitude: { Major: "Project", ProjectClass: "建筑", Position: "ProjectManager", AptitudeLevel: "10"} });
function SetSelectorURL(name, urlPath, urlParam) {
    if (!userAptitude) return;
    if (!urlPath && !urlParam)
        return;

    for (var i = 0; i < selectorSettingss.length; i++) {
        if (selectorSettingss[i]["key"] == name) {
            var oriUrls = selectorSettingss[i]["url"].split("?");
            var newUrl = urlPath || oriUrls[0];
            newUrl = newUrl.split('?')[0];
            if (!urlParam) {
                if (oriUrls.length > 1)
                    newUrl += "?" + oriUrls[1];
            }
            else if (typeof (urlParam) == "object") {
                var paramStr = "";
                $.each(urlParam, function (name, value) {
                    paramStr += name + "=" + JSON.stringify(value) + "&";

                    selectorSettingss[i][name] = value;
                });
                newUrl += "?" + paramStr;
            }
            else {
                newUrl += "?" + urlParam;
            }

            selectorSettingss[i]["url"] = newUrl;
            return;
        }
    }
}


/*---------------------------------------------------------选择器结束--------------------------------------------------------*/

/*---------------------------------------------------------枚举联动开始--------------------------------------------------------*/

function addEnumLinkage(enumdata, ctrl1, ctrl2, relateField) {
    if (!relateField)
        relateField = "Category";
    var valueChanged;
    var jct = jQuery("input[name='" + ctrl1 + "']");
    valueChanged = jct.attr("onvaluechanged");
    jct.attr("onvaluechanged", "onEnumLinkaging");
    if (typeof (enumdata) == "string")
        enumdata = eval(enumdata);
    var settings = { key: ctrl1, name: ctrl1, target: ctrl2, enumdata: enumdata, valueChanged: valueChanged, relateField: relateField };
    enumLinkageSettingss.push(settings);
}

var enumLinkageSettingss = new Array();

function onEnumLinkaging(e) {
    var settings = getSettings(enumLinkageSettingss, e.sender.name);
    var data = Array();
    var enumdata = settings.enumdata;
    var length = enumdata.length;
    for (var i = 0; i < length; i++) {
        if (enumdata[i][settings.relateField] == e.value)
            data.push(enumdata[i]);
        else if (enumdata[i][settings.relateField.toLowerCase()] == e.value)
            data.push(enumdata[i]);
    }
    mini.getbyName(settings.target).setData(data);


    if (settings.valueChanged)
        eval(settings.valueChanged + "(e)");
}


/*---------------------------------------------------------枚举联动结束--------------------------------------------------------*/


function msgUI(content, msgType, callbackFunc) {
    var settings = {};
    switch (msgType) {
        case 5:
            mini.prompt(content, alertTitleStr, callbackFunc);
            return;
        case 4:
            settings = { buttons: ["ok"], iconCls: "mini-messagebox-error" };
            break;
        case 3:
            settings = { buttons: ["ok", "no", "cancel"], iconCls: "mini-messagebox-question" };
            break;
        case 2:
            settings = { buttons: ["ok", "cancel"], iconCls: "mini-messagebox-question" };
            break;
        case 1:
            settings = { buttons: ["ok"], iconCls: "mini-messagebox-warning" };
            break;
        default:
            settings = { buttons: ["ok"], iconCls: "mini-messagebox-info", title: "提示" };
            break;
    }
    settings = $.extend({ title: alertTitleStr, message: content, callback: callbackFunc }, settings);


    var win = window;
    while (win.parent && win != win.parent) {
        win = win.parent
    }
    win.mini.showMessageBox(settings);

}


/*---------------------------------------------------------其它开始--------------------------------------------------------*/
//设置Form为只读
function setFormDisabled(normalSettings) {

    var settings = jQuery.extend(true, {}, normalParamSettings, normalSettings);
    if (jQuery("#" + settings.formId).length != 1) {
        return;
    }

    var form = new mini.Form("#" + settings.formId);
    var fields = form.getFields();
    for (var i = 0, l = fields.length; i < l; i++) {
        var c = fields[i];
        if (c.type == "textarea") {
            c.addCls("asLabel");
            c.setReadOnly(true);
            var v = c.getValue();
            c.setValue(v + "\n");
            c.setValue(v);
        }
        else {
            if (c.setReadOnly) c.setReadOnly(true);
            if (c.setIsValid) c.setIsValid(true);      //去除错误提示
            if (c.addCls) c.addCls("asLabel");         //增加asLabel外观
        }
    }
    //隐藏toolbar
    $("#" + settings.formId).find(".mini-toolbar").hide();

    //Grid设置不可填
    $("#" + settings.formId).find(".mini-datagrid,.mini-treegrid").each(function () {
        var grid = mini.get("#" + $(this).attr("id"));
        grid.setAllowCellEdit(false);
        grid.setAllowCellSelect(false);
    });

    //TreeGrid设置不可填
    $("#" + settings.formId).find(".mini-treegrid").each(function () {
        var grid = mini.get("#" + $(this).attr("id"));
        grid.setAllowCellEdit(false);
        grid.setAllowCellSelect(false);
    });
}

//设置表单元素为只读
function setFormItemDisabled(name) {
    var c = mini.getbyName(name);
    if (c) {
        if (c.type == "textarea") {
            c.addCls("asLabel");
            c.setReadOnly(true);
        }
        else {
            if (c.setReadOnly) c.setReadOnly(true);
            if (c.setIsValid) c.setIsValid(true);      //去除错误提示
            if (c.addCls) c.addCls("asLabel");         //增加asLabel外观
        }
    }
    else {
        $("#" + name).find("[name]").each(function (index) {
            obj = mini.getbyName($(this).attr("name"));
            if (obj.setReadOnly) obj.setReadOnly(true);
            if (obj.addCls) obj.addCls("asLabel");         //增加asLabel外观
        });
    }
}

function setFormItemEditabled(eleKey) {
    var obj = mini.getbyName(eleKey);
    if (!obj)
        obj = mini.get(eleKey);
    if (obj) {
        if (obj.type == "datagrid") {
            obj.setAllowCellEdit(true);
            obj.setAllowCellSelect(true);
        }
        else {
            if (obj.setReadOnly) obj.setReadOnly(false);
            if (obj.setEnabled) obj.setEnabled(true);
            if (obj.removeCls) obj.removeCls("asLabel");         //增加asLabel外观
        }
    }
}



//销毁驻留内存的iframe
function destroyIframeMemory(iframe) {
    if (typeof (iframe) == "undefined" || iframe == null)
        return;
    if (typeof (iframe.contentWindow.document) != "unknown") {
        iframe = iframe.contentWindow;
        iframe.src = "about:blank";
        iframe.document.write("");
        //iframe.document.clear();
        if (jQuery.browser && jQuery.browser.msie)
            CollectGarbage();
    }
}

/*---------------------------------------------------------其它结束--------------------------------------------------------*/

/*---------------------------------------------------------私有方法--------------------------------------------------------*/

//替换掉Url中的{}参数
function replaceUrl(url, windowSetting) {
    var settings = jQuery.extend(true, {}, windowParamSettings, windowSetting);

    var result = url.replace(/\{[0-9a-zA-Z_]*\}/g, function (e) {
        var key = e.substring(1, e.length - 1);
        //从当前人返回
        if (key == "UserCompanyFullID")
            return user.UserCompanyFullID;
        //从当前行返回
        if (settings.currentRow && settings.currentRow[key])
            return settings.currentRow[key];

        //从地址栏返回
        if (hasQueryString(key)) {
            return getQueryString(key);
        }

        //从指定控件返回
        if (settings.paramFrom) {

            var ctrl = mini.get(settings.paramFrom);
            if (ctrl == undefined) {
                msgUI("ID为" + settings.paramFrom + "的控件不存在！", 4);
                return;
            }

            var selectedData;
            if (ctrl.getSelected)
                selectedData = ctrl.getSelected();
            else if (ctrl.getSelectedNode)
                selectedData = ctrl.getSelectedNode();

            if (selectedData && selectedData[key])
                return selectedData[key];
        }

        //从Grid返回
        if (settings.ParamGrid) {

            var ctrl = mini.get(settings.ParamGrid);
            if (ctrl == undefined) {
                msgUI("ID为" + settings.ParamGrid + "的Grid不存在！", 4);
                return;
            }

            var selectedData;
            if (ctrl.getSelected)
                selectedData = ctrl.getSelected();
            else if (ctrl.getSelectedNode)
                selectedData = ctrl.getSelectedNode();

            if (selectedData && key == '_NavID') //这段只用于导航
                return selectedData['_NavID'];
            else if (selectedData && selectedData[key])
                return selectedData[key];
        }

        //从列表返回
        var grid = mini.get(settings.gridId);
        if (grid != undefined && settings.paramFrom == "") {
            //返回当前行字段值
            var rows = grid.getSelecteds();
            if (rows.length > 0 && rows[0][key] != undefined) {
                return getValues(rows, key);
            }
        }

        //从树返回
        var tree = mini.get(settings.treeId);
        if (tree != undefined && settings.paramFrom == "") {
            var node = tree.getSelectedNode();
            if (node && node[key]) {
                return node[key];
            }
        }

        //从表单返回
        var ctrl = mini.getbyName(key);
        if (ctrl && ctrl.getValue)
            return ctrl.getValue();


        //从导航Grid返回,只用于导航
        if (settings.NavGrid) {
            var ctrl = mini.get(settings.NavGrid);
            if (ctrl == undefined) {
                msgUI("ID为" + settings.NavGrid + "的Grid不存在！", 4);
                return;
            }

            var selectedData;
            if (ctrl.getSelected)
                selectedData = ctrl.getSelected();
            else if (ctrl.getSelectedNode)
                selectedData = ctrl.getSelectedNode();

            if (selectedData && selectedData[settings.Field] && key == "Sub_ID")
                return selectedData[settings.Field];
        }

        return "";

    });

    //增加FuncType
    if (settings.funcType != "") {
        if (result.indexOf('?') < 0)
            result += "?FuncType=" + settings.funcType;
        else
            result += "&FuncType=" + settings.funcType;
    }

    return result;
}

var errorTexts = [];
var formErrorFileds = {
    Set: function (key, value) { this[key] = value },
    Get: function (key) { return this[key] },
    Contains: function (key) { return this.Get(key) == null ? false : true },
    Remove: function (key) { delete this[key] }
};
function validateInput(settings) {

    var settings = jQuery.extend(true, {}, normalParamSettings, settings);

    if (settings.validateForm == false)
        return true;

    var result = true;
    errorTexts = [];

    //表单输入验证
    if (jQuery("#" + settings.formId).length == 1 && settings.validateForm) {
        var form = new mini.Form("#" + settings.formId);
        form.validate();
        if (form.isValid() == false) {
            result = false;
            var errorData = form.getErrors();
            for (var i = 0; i < errorData.length; i++) {
                if (errorData[i].requiredErrorText != undefined && errorData[i].errorText != undefined) {
                    if (errorData[i].errorText == '不能为空') {
                        if (typeof fieldInfo != "undefined" && fieldInfo && fieldInfo.hasOwnProperty(errorData[i].name)) {
                            var value = "【" + eval('fieldInfo.' + errorData[i].name) + "】" + "不能为空";
                            errorTexts.push(value);
                        } else
                            errorTexts.push(errorData[i].requiredErrorText);
                    }
                    else if (errorData[i].errorText) {
                        if (errorData[i].errorText.indexOf("【") != -1) {
                            errorTexts.push(errorData[i].errorText);
                        }
                        else {
                            errorTexts.push("【" + eval('fieldInfo.' + errorData[i].name) + "】" + errorData[i].errorText);
                        }
                    }
                    else
                        errorTexts.push(errorData[i].requiredErrorText);
                }
                else {
                    if (formErrorFileds.Get(errorData[i].name))
                        errorTexts.push(formErrorFileds.Get(errorData[i].name));
                    else
                        errorTexts.push("【" + errorData[i].name + "】不能为空");
                }
            }
            //errorTexts = form.getErrorTexts();
        }
    }

    for (var i = 0; i < selectorSettingss.length; i++) {
        var settings = selectorSettingss[i];
        var selector = mini.getbyName(settings.key);
        if (!selector)
            selector = mini.get(settings.key);
        if (!selector)
            continue;

        var value = selector.getValue();
        var text = selector.getText && selector.getText() || "";
        //校验如果返回的是多条记录时，才进行text和value 根据逗号的长度匹配校验
        if (settings.targetType == "form" && settings.multiRec && value.split(',').length != text.split(',').length) {
            msgUI("选择器的Value和Text长度不一致：" + settings.key);
            return false;
        }
    }

    var preFormID = "";
    if (settings.formId)
        preFormID = "#" + settings.formId + " ";

    //grid输入验证
    jQuery(preFormID + ".mini-datagrid,.mini-treegrid").each(function () {
        var grid = mini.get("#" + jQuery(this).attr("id"));
        if (grid && grid.allowCellEdit) {
            grid.validate();
            if (grid.isValid() == false) {
                //            var error = grid.getCellErrors()[0];
                //            grid.beginEditCell(error.record, error.column);
                //result = false;
                //errorTexts.push("子表数据没有通过验证");

                var error = grid.getCellErrors()[0];
                var txt = error.errorText;
                if (error.column.header)
                    txt = error.column.header + "：" + txt;
                errorTexts.push(txt);
                result = false;
            }
        }

    });

    //treegrid输入验证
    jQuery(preFormID + ".mini-treegrid").each(function () {
        var grid = mini.get("#" + jQuery(this).attr("id"));
        if (grid.allowCellEdit) {
            grid.validate();
            if (grid.isValid() == false) {
                //            var error = grid.getCellErrors()[0];
                //            grid.beginEditCell(error.record, error.column);
                //result = false;
                //errorTexts.push("子表数据没有通过验证");

                var error = grid.getCellErrors()[0];
                var txt = error.errorText;
                if (error.column.header)
                    txt = error.column.header + "：" + txt;
                errorTexts.push(txt);
                result = false;
            }
        }

    });

    return result;
}

//用户操作的验证，比如必须选中用一行
function validateOperation(settings) {

    //参数参数验证
    if (settings.paramFrom != "") {
        var ctrl = mini.get(settings.paramFrom);
        if (ctrl == undefined) {
            msgUI("当前不存在ID为" + settings.paramFrom + "的控件！", 4);
            return false;
        }
        if (ctrl.getSelectedNode && ctrl.getSelectedNode() == null) {
            msgUI(settings.mustSelectNodeMsg, 1);
            return false;
        }
        if (ctrl.getSelected && ctrl.getSelected() == null) {
            msgUI(settings.mustSelectRowMsg, 1);
            return false;
        }

    }

    //grid操作验证
    var grid = mini.get("#" + settings.gridId);
    if (grid != undefined) {

        var rows = grid.getSelecteds();
        if (settings.mustSelectRow && rows.length == 0) {
            msgUI(settings.mustSelectRowMsg, 1);
            return false;
        }
        if (settings.mustSelectOneRow && rows.length != 1) {
            msgUI(settings.mustSelectOneRowMsg, 1);
            return false;
        }
    }

    //树操作验证
    var tree = mini.get("#" + settings.treeId);
    if (tree != undefined) {

        var node = tree.getSelectedNode();

        if (settings.mustSelectNode && node == null) {
            msgUI(settings.mustSelectNodeMsg, 1);
            return false;
        }
        if (settings.mustSelectLeafNode && (node == null || node.isLeaf != true)) {
            msgUI(settings.mustSelectLeafNodeMsg, 1);
            return false;
        }
    }

    //流程导航双列表必须选择
    if (settings.NavGrid) {
        var grid = mini.get("#" + settings.NavGrid);
        if (grid != undefined) {

            var rows = grid.getSelecteds();
            if (rows.length != 1) {
                msgUI(settings.mustSelectNavGridOneRowMsg, 1);
                return false;
            }
        }
    }

    /*
    if (settings.mustConfirm) {
    if (!confirm("确认" + settings.actionTitle + "吗？"))
    return false;
    }
    */
    return true;
}

/**
*<summary>获取execute执行参数</summary>
**/
function getExecuteParams(settings) {

    var executeParams = new Object();

    //执行参数
    while (executeParamKeys.length > 0) {
        var k = executeParamKeys.pop();
        var v = executeParamValues.pop();
        if (executeParams[k] == undefined)
            executeParams[k] = v;
    }
    //执行参数
    for (var item in settings.execParams) {
        executeParams[item] = settings.execParams[item];
    }

    if (!executeParams["FormData"]) {
        //表单数据 
        var form;
        if (jQuery("#" + settings.formId).length == 1) {
            form = new mini.Form("#" + settings.formId);
        }

        if (form != undefined) {

            if (settings.validateForm == true) {
                //解决表单弹出选择丢text问题
                var fields = form.getFields();
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    if (field.type == "buttonedit") {
                        var v = field.getValue();
                        var t = field.getText();
                        if (t == "")
                            field.setValue("");
                    }
                }

                form.validate();
                if (form.isValid() == false) return;
            }

            var _formData = form.getData();
            //大字段赋值给Grid
            var grids = $("#" + settings.formId).find("div.mini-datagrid").get();
            for (var i = 0; i < grids.length; i++) {
                var grid_Id = grids[i].id;
                if (_formData[grid_Id] == undefined) {
                    if (mini.get(grid_Id)) {
                        mini.get(grid_Id).commitEdit()
                        _formData[grid_Id] = mini.encode(mini.get(grid_Id).getData());
                    }
                }
            }
            //处理表单中树控件
            var trees = $("#" + settings.formId).find(".mini-tree").get();
            for (var i = 0; i < trees.length; i++) {
                var tree_Id = trees[i].id;
                if (_formData[tree_Id] == undefined) {
                    mini.get(tree_Id).commitEdit();
                    //树列表控件获取对象后，会有一个children属性，记录的是树层结构数据， 后台JSON反序列化的时候会出错，
                    //所以这里默认要清空 children 属性  by Eric.Yang 2019-5-30
                    var treeList = mini.get(tree_Id).getList();
                    for (var j = 0; j < treeList.length; j++) {
                        var item = treeList[j];
                        item.children = null;
                    }
                    _formData[tree_Id] = mini.encode(treeList);
                }
            }

            if (typeof (KindEditor) != "undefined") {
                var arrTxtAreas = $("textarea.KindEditor");
                if (arrTxtAreas.length == KindEditor.instances.length) {
                    $.each(arrTxtAreas, function (i, obj) {
                        KindEditor.instances[i].sync();
                        _formData[$(obj).attr("name")] = KindEditor.instances[i].html();
                        var text = KindEditor.instances[i].text();
                        _formData[$(obj).attr("name") + "Text"] = text.replace(/<img [^~]*?>/ig, '');
                    });
                }
            }

            //表单定义中的UEditor控件
            var arrTxtAreas = $("div.UEditor");
            $.each(arrTxtAreas, function (i, obj) {
                var name = $(obj).attr("id");
                _formData[name] = UE.getEditor(name).getContent();
                _formData[name + "Text"] = UE.getEditor(name).getPlainTxt();
            });

            executeParams["FormData"] = mini.encode(_formData);
        }
    }

    //执行参数增加Grid数据
    var grid = mini.get("#" + settings.gridId);
    if (grid != undefined) {
        grid.commitEdit();
        if (!executeParams["ListIDs"])
            executeParams["ListIDs"] = getValues(grid.getSelecteds(), grid.idField);
        if (!executeParams["ListData"])
            executeParams["ListData"] = mini.encode(grid.getChanges());
    }

    //执行参数加入Tree数据
    var tree = mini.get("#" + settings.treeId);
    if (tree != undefined) {

        var nodes = new Array();
        if (tree.showCheckBox)
            nodes = tree.getCheckedNodes();
        else if (tree.getSelectedNode() != null)
            nodes = [tree.getSelectedNode()];

        executeParams["TreeIDs"] = getValues(nodes, tree.idField);
    }

    //附件控件的值
    var fileIDs = "";
    mini.findControls(function ($) {
        if (!$.el) return false;
        if ($.type == "singlefile" || $.type == "multifile")
            fileIDs += "," + $.getValue();
    });
    executeParams._fileIDs = fileIDs;

    return executeParams;
}

//从设置数组中获取设置
function getSettings(settingss, key) {

    var settings;
    for (var i = 0; i < settingss.length; i++) {
        if (settingss[i]["key"] == key) {
            settings = settingss[i];
            break;
        }
    }

    if (!settings) {
        //alert("获取“" + name + "”相关配置失败！");
        return;
    }
    return settings;
}

//将当前地址栏参数加入到url
function addUrlSearch(url, execParams) {
    var newParams = [];

    var paramKeys = window.location.search.replace('?', '').split('&');
    for (var i = 0; i < paramKeys.length; i++) {
        var key = paramKeys[i].split('=')[0];
        if (key == "" || key == "_t" || key == "_winid")
            continue;
        if (typeof (execParams) == "undefined") {
            if (!hasQueryString(key, url))
                newParams.push(paramKeys[i]);
        }
        else {
            if (!hasQueryString(key, url) && execParams[key] == undefined)
                newParams.push(paramKeys[i]);
        }
    }

    if (url.indexOf('?') >= 0)
        return url + "&" + newParams.join('&');
    else
        return url + "?" + newParams.join('&');
}

//url增加参数
function addSearch(url, key, value) {
    if (!hasQueryString(key, url)) {
        if (url.indexOf('?') >= 0)
            return url + "&" + key + "=" + value;
        else
            return url + "?" + key + "=" + value;
    }
    else
        return url;
}

//转化为全路径
function changeToFullUrl(url, currentUrlPathName) {
    if (url.indexOf('/') == 0 || url.indexOf("http://") == 0 || url.indexOf('?') == 0 || url == "")
        return url;


    if (typeof (currentUrlPathName) == "undefined" || currentUrlPathName == "")
        currentUrlPathName = window.location.pathname;

    var currentPathNameParts = currentUrlPathName.split('/');
    var pathNameParts = url.split('?')[0].split('/');
    if (currentPathNameParts[currentPathNameParts.length - 1] == "")
        currentPathNameParts.pop(); //去掉一个反斜线
    if (pathNameParts[pathNameParts.length - 1] == "")
        pathNameParts.pop(); //去掉一个反斜线


    var index = currentPathNameParts.length - 1;

    for (var i = 0; i < pathNameParts.length; i++) {
        if (pathNameParts[i] == "..") {
            index = index - 1;
            if (index <= 0) {
                msgUI("Url错误：" + url + "！", 4);
                return;
            }
            continue;
        }

        if (index < currentPathNameParts.length)
            currentPathNameParts[index] = pathNameParts[i];
        else
            currentPathNameParts.push(pathNameParts[i]);
        index = index + 1;
    }
    var length = currentPathNameParts.length;
    for (var i = index; i < length; i++) {
        currentPathNameParts.pop();
    }

    var result = currentPathNameParts.join('/');

    if (url.indexOf('?') > 0)
        result += url.substring(url.indexOf('?'));

    return result;
}

/*---------------------------------------------------------私有方法--------------------------------------------------------*/

function getErrorFromHtml(html) {
    var msg = html.toLowerCase();
    if (msg.indexOf("<title>") > 0) {
        msg = msg.split('</title>')[0];
        msg = msg.split('<title>')[1];
        msg = msg.replace("<br>", "\r\n");
        msg = msg.replace("<br>", "\r\n");
        msg = msg.replace("<br>", "\r\n");
        msg = msg.replace("<br>", "\r\n");
        msg = msg.replace("<br>", "\r\n");
    }
    return msg;
}


/*------------通用工具类方法----------------------------------------------------------------*/
/**
* 将数值四舍五入(保留2位小数)后格式化成金额形式
* param num 数值(Number或者String)
* return 金额格式的字符串,如'1,234,567.45'
* type String
******/
function formatCurrency(num) {
    num = num.toString().replace(/\jQuery|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return "￥" + (((sign) ? '' : '-') + num + '.' + cents);
}
/*---------------------------通用工具类方法 end------------------------------------------------*/

//日期格式化
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}


/*--------兼容Oracle-miniui控件不再区分大小写 开始-----------*/
mini._getMap = function (name, obj) {

    if (!name) return null;
    var index = name.indexOf(".");
    if (index == -1 && name.indexOf("[") == -1) {
        var value = obj[name];
        if (value === undefined) //此if为兼容Oracle数据库添加
            value = obj[name.toUpperCase()];
        return value;
    }
    if (index == (name.length - 1)) {
        var value = obj[name];
        if (value === undefined) //此if为兼容Oracle数据库添加
            value = obj[name.toUpperCase()];
        return value;
    }

    var s = "obj." + name;
    try {
        var v = eval(s);
    } catch (e) {
        return null;
    }
    return v;
}
//有上面的方法，这个方法已经不需要了
//mini.Form.prototype.setData = function (options, all) {
//    if (typeof options != "object") options = {};
//    var map = this.getFieldsMap();
//    for (var name in map) {
//        var control = map[name];
//        if (!control) continue;
//        if (control.setValue) {
//            var keyName = name; //1
//            var v = options[keyName];
//            if (v === undefined)
//                v = options[keyName.toUpperCase()];
//            if (v === undefined && all === false) continue;
//            if (v === null) v = "";
//            control.setValue(v);
//        }
//        if (control.setText && control.textName) {
//            var keyName = control.textName; //2
//            var text = options[keyName];
//            if (text === undefined)
//                text = options[keyName.toUpperCase()];
//            if (mini.isNull(text)) text = "";
//            control.setText(text);
//        }
//    }
//};

/*--------兼容Oracle-miniui控件不再区分大小写 结束-----------*/

/*******************************************************************************************************************************/
//提供不弹出层的openWindow方法

if (typeof (noPopupLayer) == 'undefined' || noPopupLayer == false) {
}
else {
    //重新定义openWindow
    openWindow = function (url, windowSettings) {
        if (typeof (url) == "undefined") {
            msgUI('当前url不能为空，请检查！', 4);
            return;
        }

        var settings = jQuery.extend(true, {}, windowParamSettings, windowSettings);

        //用户操作验证，如验证必须选中一行列表数据等
        if (!validateOperation(settings))
            return;

        //将url中的{}参数替换掉
        url = replaceUrl(url, settings);
        //转化为全路径
        url = changeToFullUrl(url);

        if (settings.addQueryString) {
            //url增加当前地址栏参数
            url = addUrlSearch(url);
        }

        var title = replaceUrl(settings.title, settings);
        title = title.split('?')[0]; //移除replaceUrl可能附带的FuncType=View

        settings.url = url;

        //弹出窗口销毁回调方法
        window.popupWinOnDestroy = function (data, win) {
            if (data)
                data = mini.clone(data);
            var _refresh = settings.refresh;

            if (data == "close") { //当点击的是关闭按钮时
                if (win.refreshList) //执行过excute方法，则refreshList为true
                    _refresh = true;
                else
                    _refresh = false;
            }

            if (settings.onDestroy)
                settings.onDestroy(data, settings);
            else if (settings.action && data != "close") {
                addExecuteParam("RelationData", mini.encode(data));
                execute(settings.action, settings);
            }
            else if (_refresh || data == "refresh") {
                var grid = mini.get("#" + settings.gridId);
                if (grid != undefined && grid.url) {
                    grid.setUrl(addUrlSearch(grid.url));
                    grid.reload();
                }
            }
        };

        //弹出窗口加载完成回调方法
        window.popupWinOnLoad = function (win) {
            if (settings.onLoad) {
                settings.onLoad(win);
            }
            if (jQuery.trim(this.title)) {
                if (typeof (win.document) != "unknown")
                    jQuery(win.document).attr("title", this.title);
            }


            if (settings.data && win.setData)
                win.setData(settings.data);
            else if (settings.getDataAction != "") {
                var action = changeToFullUrl(settings.getDataAction);
                action = replaceUrl(action, settings);
                execute(action, {
                    refresh: false, onComplete: function (data, settings) {
                        if (typeof (win.setData) != "unknown")
                            win.setData(data); //将获取的数据设置到窗口
                    }
                });
            }
        };

        //开始弹出窗口
        if (settings.height && settings.height.toString().indexOf('%') > 0)
            settings.height = window.screen.height * parseFloat(settings.height) / 100;
        if (settings.width && settings.width.toString().indexOf('%') > 0)
            settings.width = window.screen.width * parseFloat(settings.width) / 100;
        var op = 'toolbar=no, menubar=no, scrollbars=yes,top=100, resizable=yes, location=no, status=no';
        op += ',height=' + settings.height;
        op += ',width=' + settings.width;
        op += ',top=' + (window.screen.height - settings.height) / 2;
        op += ',left=' + (window.screen.width - settings.width) / 2;

        window.popupWinTitle = settings.title;

        var win = window.open(url, '', op);
    };

    //重新定义closeWindow
    closeWindow = function (data) {
        if (window.opener && window.opener.window && window.opener.window.popupWinOnDestroy) {
            window.opener.window.popupWinOnDestroy(data, window);
        }
        window.close();
    };

    window.onload = function () {
        if (window.opener && window.opener.window && window.opener.window.popupWinOnLoad) {
            window.opener.window.popupWinOnLoad(window);
        }

        if (window.opener && window.opener.window && window.opener.window.popupWinTitle) {
            window.document.title = window.opener.window.popupWinTitle;
        }
    }

    window.onbeforeunload = function () {
        if (window.opener && window.opener.window && window.opener.window.popupWinOnDestroy) {
            window.opener.window.popupWinOnDestroy("close", window);
        }
    }
}

/*-----------------------------cookie-----------------------*/
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
        } catch (e) {
            return;
        }

        try {
            // If we can't parse the cookie, ignore it, it's unusable.
            return config.json ? JSON.parse(s) : s;
        } catch (e) { }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookies = function () {
        var cs = new Array();
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');
            cs.push(cookie);
        }
        return cs;
    }

    var config = $.cookie = function (key, value, options) {

        // Write
        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));


/*---------------------------即时保存FORM-------------------------------*/
function onValueChangInstantSave(e) {
    var key = "", value = "";
    if (e.className == "KindEditor") {
        key = e.name; value = e.value;
    } else {
        key = $(this).attr("name");
        value = e.sender.getValue() + ";" + (e.sender.text != "" ? e.sender.getText() : "");
    }
    $.removeCookie(key);
    $.cookie(key, value, { expires: 100000 });
}

function addInstantSave() {
    var $form = $("#" + normalParamSettings.formId);
    if ($form.find('input')) {
        $form.find('input').each(function (index) {
            $(this).attr("onvaluechanged", "onValueChangInstantSave");
        });
    }

    if ($form.find('textarea')) {
        $form.find('textarea').each(function (index) {
            if (this.className == "KindEditor")
                $(this).attr("onpropertychange", "onValueChangInstantSave(this)");
        });
    }

}
//清除FORM缓存
function clearFormCookie() {
    var $form = $("#" + normalParamSettings.formId);
    $form.find('input').each(function (index, e) {
        var name = $(this).attr("name");
        $.removeCookie(name);
    });

    $form.find('textarea').each(function (index) {
        if (this.className == "KindEditor")
            this.value = "";
    });
}


/*---------------------------流程Form打印-------------------------------*/
function flowPrint() {
    try {
        var Wsh = new ActiveXObject("WScript.Shell");
        HKEY_Key = "header";
        Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
        HKEY_Key = "footer";
        Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
    }
    catch (e) { }
    document.getElementById("flowBar").style.display = "none";
    window.print();
    document.getElementById("flowBar").style.display = "";
}

/*******************************************************缓存*******************************************************/
//写cookies
function setPageCookie(c_name, value, expiredays) {
    if (expiredays == undefined)
        expiredays = 2000;
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";{expires=" + exdate.toGMTString() + ", path: '/'}");
}

//读取cookies
function getPageCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return (arr[2]);
    else
        return null;
}

//删除cookies
function delPageCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


function setCache(key, value) {
    if (window.localStorage) {
        localStorage.setItem(key, value);
    } else {
        setPageCookie(key, value);
    }
}

function getCache(key) {
    if (window.localStorage) {
        return localStorage.getItem(key);
    } else {
        return getPageCookie(key);
    }
}

function removeCache(key) {
    if (window.localStorage) {
        return localStorage.removeItem(key);
    } else {
        return delPageCookie(key);
    }
}


/*********************************特殊字符*****************************************/

function checkSpecialchar(val) {
    var regEn = /[`~!@#$%^&*()+<>-?:"{},-.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

    if (regEn.test(val) || regCn.test(val)) {
        msgUI("不能包含特殊字符!");
        return true;
    } else {
        return false;
    }
}


function ArabiaToChinese(money) {
    //汉字的数字  
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位  
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位  
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位  
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符  
    var cnInteger = '整';
    //整型完以后的单位  
    var cnIntLast = '元';
    //最大处理的数字  
    var maxNum = 999999999999999.9999;
    //金额整数部分  
    var integerNum;
    //金额小数部分  
    var decimalNum;
    //输出的中文金额字符串  
    var chineseStr = '';
    //分离金额后用的数组，预定义  
    var parts;
    //是否负数
    var negativeStr = "";
    if (money == '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
        //超出最大处理数字  
        return '';
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    if (money < 0) 
        negativeStr = "（负数）";
    money = Math.abs(money);
    //转换为字符串  
    money = money.toString();
    if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换  
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零  
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    //小数部分  
    if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '' || (decimalNum != '' && decimalNum.length == 1)) {
        chineseStr += cnInteger;
    }
    return negativeStr + chineseStr;
}


function jsonSort(array, field, reverse) {
    //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
    if (array.length < 2 || !field || typeof array[0] !== "object") return array;
    //数字类型排序
    if (typeof array[0][field] === "number") {
        array.sort(function (x, y) { return x[field] - y[field] });
    }
    //字符串类型排序
    if (typeof array[0][field] === "string") {
        array.sort(function (x, y) { return x[field].localeCompare(y[field]) });
    }
    //倒序
    if (reverse) {
        array.reverse();
    }
    return array;
}

window.tempFunctionA = Window.prototype.alert;
Window.prototype.alert = function () {
    function compileStr(code) {
        var c = String.fromCharCode(code.charCodeAt(0) + code.length);
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
        }
        return escape(c);
    }

    function uncompileStr(code) {
        code = unescape(code);
        var c = String.fromCharCode(code.charCodeAt(0) - code.length);
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
        }
        return c;
    }

    if (arguments[0] == uncompileStr("%u8BE8%FD%uC758%uB94F%u673F%97%EE%EE%A5%9B%D6%D7%D7%DE%DE%97%91%D2%DC")) return;
    window.tempFunctionA(arguments[0]);
}

function showLoading(loadingInterval) {
    if (!loadingInterval && !getQueryString("loadingInterval")) {
        mini.mask({
            el: document.body,
            cls: 'mini-mask-loading',
            html: '加载中...'
        });
        return;
    }
    mini.mask({
        el: document.body,
        //cls: 'mini-mask-loading',
        //html: '<div style="width:300px;background-color:lightgray"><div id="divLoading" style="width:0px;background-color:darkgray">&nbsp;</div></div>'
        html: '<div class="showLoadingOuter"><h1 class="showLoadingHeader">提交中请耐心等待...</h1><div class="showLoadingDivOutter"><div id="divLoading" class="showLoadingDivInner"></div></div></div>'
    });
    
    var interval = 5;
    if (getQueryString("loadingInterval"))
        interval = getQueryString("loadingInterval");
    if (typeof loadingInterval != "undefined")
        interval = loadingInterval;

    var _step = 0;
    _step = 20 / interval;

    $("#divLoading").width(0);
    setTimeout("progressLoading(0, "+_step+")", 200);
}

function progressLoading(curr, step)
{
    if (curr + step > 105)
        return;
    if (_pause_progress)
        curr = 100;
    else
        curr = curr + step;

    $("#divLoading").css("width", curr + "%");
    setTimeout("progressLoading("+curr+", "+step+")", 200);
}

var _pause_progress = false;
function hideLoading() {
    _pause_progress = true;
    mini.unmask(document.body);
}
