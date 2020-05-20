
//说明：
//  0、必须熟练掌握接口
//  1、setting参数可以省略
/*---------------------------------------------------------基本方法开始--------------------------------------------------------*/
//  clearDataForm(normalSettings);
//  clearQueryForm(normalSettings);
//  search(normalSettings);
//  quickSearch(searchFields, normalSettings)
//  add(windowSettings);
//  edit(windowSettings);
//  view(windowSettings);
//  del(execSettings);
//  save(execSettings);
//  saveList(execSettings);
//  saveSortedList(execSettings);
//  addRow(newRowJson, normalSettings);   //createId参数用于自动产生ID，推荐表单子表使用
//  delRow(normalSettings);
//  ExportExcel(gridId)     导出Excel
/*---------------------------------------------------------基本方法结束--------------------------------------------------------*/
/*---------------------------------------------------------树维护开始--------------------------------------------------------*/
//  saveNode(execSettings);
//  searchTree(normalSettings);
//  nodeViewing(windowSettings);
//  nodeEditing(windowSettings);
//  nodeAdding(windowSettings);
//  nodeDeleting(windowSettings);
//  onNodeDroping(e);
//  onNodeDrop(e);
//  relationAppending(url, windowSettings);
//  relationAppended(data, settings);
//  relationSetting(url, windowSettings);
//  relationSet(url, windowSettings);
//  delRelation(execSettings);
//  addRelationData(windowSettings);
//  editRelationData(windowSettings);
//  viewRelationData(windowSettings);
//  saveRelationData(execSettings);
//  delRelationData(execSettings);
/*---------------------------------------------------------树维护结束--------------------------------------------------------*/
/*---------------------------------------------------------选人选部门开始--------------------------------------------------------*/
//  returnForm(windowSettings);
//  returnList(windowSettings);
//  addSingleUserSelector(name, selectorSettings);
//  addMultiUserSelector(name, selectorSettings);
//  addSingleOrgSelector(name, selectorSettings);
//  addMultiOrgSelector(name, selectorSettings);
//  addSingleRoleSelector(name, selectorSettings);
//  addMultiRoleSelector(name, selectorSettings);
/*---------------------------------------------------------选人选部门结束--------------------------------------------------------*/
/*---------------------------------------------------------流程方法开始--------------------------------------------------------*/
//  flowLoadMenubar(jsonFormData);
//  flowAdd(flowCode,windowSettings);
//  flowEdit(flowCode,windowSettings);
/*---------------------------------------------------------流程方法结束--------------------------------------------------------*/

//  ExportWord(tmplCode,id);

//参数开关
if (typeof allowUrlOpenForm == "undefined")
    allowUrlOpenForm = true;// 允许从地址栏打开表单页面

/*---------------------------------------------------------页面配置信息开始--------------------------------------------------------*/
var listConfig = {
    title: "",
    width: '80%',
    height: '80%'
};
var treeConfig = {
    title: "",
    width: 720,
    height: 605
};
var relationConfig = {
    title: "",
    width: '80%',
    height: '80%'
};

/*---------------------------------------------------------页面配置信息结束--------------------------------------------------------*/
/*---------------------------------------------------------权限常量开始--------------------------------------------------------*/

/*---------------------------------------------------------权限常量结束--------------------------------------------------------*/
/*---------------------------------------------------------Url常量开始--------------------------------------------------------*/
var urlConstant = {
    singleOrg: "/MvcConfig/Auth/Org/Selector?SelectMode=Single",
    multiOrg: "/MvcConfig/Auth/Org/Selector?SelectMode=Multi",
    singleRole: "/MvcConfig/Auth/Role/Selector?SelectMode=Single&GroupID=",
    multiRole: "/MvcConfig/Auth/Role/Selector?SelectMode=Multi&GroupID=",
    singleUser: "/MvcConfig/Auth/User/SingleSelector?",
    multiUser: "/MvcConfig/Auth/User/MultiSelector?",
    singleScopeUser: "/MvcConfig/Auth/User/SingleScopeSelector?GroupID=",
    multiScopeUser: "/MvcConfig/Auth/User/MultiScopeSelector?GroupID=",
    multiRes: "/MvcConfig/Auth/Res/Selector?SelectMode=Multi&RootFullID=a1b10168-61a9-44b5-92ca-c5659456deb5",
    multiRule: "/MvcConfig/Auth/Res/RuleSelector?SelectMode=Multi&RootFullID=a1b10168-61a9-44b5-92ca-c5659456deb6",
    singleRes: "/MvcConfig/Auth/Res/Selector?SelectMode=Single&RootFullID=a1b10168-61a9-44b5-92ca-c5659456deb5",
    singleRule: "/MvcConfig/Auth/Res/RuleSelector?SelectMode=Single&RootFullID=a1b10168-61a9-44b5-92ca-c5659456deb6",
    singleEnum: "/MvcConfig/Meta/Enum/SingleSelector?EnumKey=",
    multiEnum: "/MvcConfig/Meta/Enum/MultiSelector?EnumKey=",
    flowComment: "/MvcConfig/Workflow/Trace/",
    flowAskTask: "/MvcConfig/Workflow/Trace/AskTask",
    QRCodeCreate: "/MvcConfig/UI/List/CreateQRCode",
    QRCodeDownLoad: "/MvcConfig/UI/List/DownLoadQRCode",
    CreateQRCodes: "/MvcConfig/UI/List/CreateQRCodes",
    ExportQRCode: "/MvcConfig/UI/List/QRCodeToPdf"
};


/*---------------------------------------------------------Url常量结束--------------------------------------------------------*/
/*---------------------------------------------------------通用枚举开始--------------------------------------------------------*/

var yesNo = [{ "value": "1", "text": "是" }, { "value": "0", "text": "否" }];

/*---------------------------------------------------------通用枚举结束--------------------------------------------------------*/


/*---------------------------------------------------------页面加载过程开始----------------------------------------------------*/
var alreadyInit = false;        //是否已经执行过PageInit
var ncKey = '_ncCookie';

//解决grid开始排序失效
var gridSortFields = {};
var gridSortOrder = {};
var gridAutoLoad = {};
//window.status = "|a0." + new Date().getSeconds() + ":" + new Date().getMilliseconds();

function preInit() {

    //谷歌浏览器中FieldSet靠左
    $("fieldset").attr("align", "left");

    //处理验证信息
    $("input[required],textarea[required],div[required]").each(function () {
        var str = "";
        var $input = $(this);
        if ($input.attr("requiredErrorText") != undefined) {
            str = $input.attr("requiredErrorText");
        } else {
            if (this.parentNode.previousSibling && this.parentNode.previousSibling.previousSibling) {
                var obj = this.parentNode.previousSibling.previousSibling.innerText;
                if (obj)
                    str = obj.replace(/\s+/g, "");
            }
            if (!str && this.parentNode.previousSibling) {
                var obj = this.parentNode.previousSibling.innerText;
                if (obj)
                    str = obj.replace(/\s+/g, "");
            }
            if ($.trim(str) == "") {
                var obj = this.parentNode.innerText;
                if ($.trim(obj) != "") {
                    str = obj.replace(/\s+/g, "");
                } else {
                    if (typeof fieldInfo != "undefined" && fieldInfo && fieldInfo.hasOwnProperty(this.name)) {
                        str = eval('fieldInfo.' + this.name);
                    }
                }
            }
        }
        var value = "【" + str + "】" + "不能为空";
        formErrorFileds.Set($input[0].name, value);
        $input.attr("requiredErrorText", value);
    });

    //处理表单升版
    if (hasQueryString("UpperVersion")) {
        $("#dataForm").attr("url", "GetUpperVersionData");
    }

    //统一去掉帮助按钮
    if (typeof (showHelpBtn) == "undefined" || showHelpBtn == false) { //此参数在MvcAdapter的GetBasicInfo方法中获取
        $("a[onclick='showHelp()']").hide();
        $("a[onclick='showHelp();']").hide();
    }
    else {

        //需要显示帮助按钮，如果帮助按钮不存在，则添加
        //if ($(".gw-toolbar-right").find("a[onclick='showHelp()']").length == 0) {
        //    var html = $(".gw-toolbar-right").html();
        //    if (html == undefined || html == null) {
        //        if ($(".mini-toolbar td").last().length != 0) {
        //            $(".mini-toolbar td").last().html($(".mini-toolbar td").last().html() + '<a class="mini-button" onclick="showHelp()" iconcls="icon-help" plain="true">帮助</a>');
        //        } else {
        //            document.body.innerHTML +=
        //                '<div style="position:absolute;height:10px;float:right;z-index:100;right:0;top:0;"><a class="mini-button" onclick="showHelp()" iconcls="icon-help" plain="true">帮助</a></div>';
        //        }
        //    } else {
        //        html += '<a class="mini-button" onclick="showHelp()" iconcls="icon-help" plain="true">帮助</a>';
        //        $(".gw-toolbar-right").html(html);
        //    }
        //}
    }

    //附加只读样式
    $("input[enabled='false']").removeAttr("enabled").attr("readonly", "true").addClass("asLabel");

    //预处理树，树的获取数据Url增加当前地址栏参数
    $(".mini-tree,.mini-treegrid").each(function () {
        var $tree = $(this);
        if ($tree.attr("autoload") == undefined || !$tree.attr("autoload")) {
            $tree.attr("autoload", "true");
        }
        var url = $tree.attr("url");
        if (url != undefined && url != null && url != "") {
            url = changeToFullUrl(url);
            url = addUrlSearch(url); //url增加当前地址栏参数        
            $tree.attr("url", url);
        }
    });

    //预处理Outlook树，树的获取数据Url增加当前地址栏参数
    $(".mini-outlooktree").each(function () {
        var $tree = $(this);

        if ($tree.attr("autoload") == undefined || !$tree.attr("autoload")) {
            $tree.attr("autoload", "true");
        }
        var url = $tree.attr("url");
        if (url != undefined && url != null && url != "") {
            url = changeToFullUrl(url);
            url = addUrlSearch(url); //url增加当前地址栏参数        
            $tree.attr("url", url);
        }
    });

    //预处理combobox，Url增加当前地址栏参数，并转化全路径
    $(".mini-combobox").each(function () {
        var $combobox = $(this);
        var url = $combobox.attr("url");
        if (url != undefined && url != null && url != "") {
            url = changeToFullUrl(url);
            url = addUrlSearch(url); //url增加当前地址栏参数        
            $combobox.attr("url", url);
        }
        if ($combobox.attr("valueField") == undefined || $combobox.attr("valueField") == "id") {
            $combobox.attr("valueField", "value");
        }
    });

    //预处理radiobuttonlist
    $(".mini-radiobuttonlist").each(function () {
        var $item = $(this);
        if ($item.attr("valueField") == undefined) {
            $item.attr("valueField", "value");
        }
    });

    //预处理checkboxlist
    $(".mini-checkboxlist").each(function () {
        var $item = $(this);
        if ($item.attr("valueField") == undefined) {
            $item.attr("valueField", "value");
        }
    });

    //预处理TreeGrid
    $(".mini-treegrid").each(function () {
        var $item = $(this);
        //解决Grid控件开始排序字段失效问题
        gridSortFields[$item.attr("id")] = $item.attr("sortField");
        gridSortOrder[$item.attr("id")] = $item.attr("sortOrder");

        //列头居中
        $item.find("div[field]").each(function () {
            var $item = $(this);
            $item.attr("headeralign", "center");
        });

        if ($item.attr("pagesize") == undefined)
            $item.attr("pagesize", "50");

        if ($item.attr("sizeList") == undefined)
            $item.attr("sizeList", "[10,20,50,100,200,300,500]");
    });

    //预处理Grid
    $(".mini-datagrid").each(function () {
        var $item = $(this);
        //解决Grid控件开始排序字段失效问题
        gridSortFields[$item.attr("id")] = $item.attr("sortField");
        gridSortOrder[$item.attr("id")] = $item.attr("sortOrder");

        //Grid列头居中
        $item.find("div[field]").each(function () {
            var $item = $(this);
            $item.attr("headeralign", "center");
        });

        if ($item.attr("pagesize") == undefined)
            $item.attr("pagesize", "50");

        //if ($item.attr("allowunselect") == undefined)
        //    $item.attr("allowunselect", "true");

        if ($item.attr("sizeList") == undefined)
            $item.attr("sizeList", "[10,20,50,100,200,300,500]");
        gridAutoLoad[$item.attr("id")] = true;
        if ($item.attr("autoload") && $item.attr("autoload").toLowerCase() == "false") {
            gridAutoLoad[$item.attr("id")] = false;
        }
        if ($item.attr("onload") == undefined)
            $item.attr("onload", "onGridLoad");
        if ($item.attr("onpreload") == undefined)
            $item.attr("onpreload", "onGridPreLoad");//关闭iis详细后，列表数据报错提示优化
        if ($item.attr("onselectionchanged") == undefined)
            $item.attr("onselectionchanged", "onSelectoinChanged");

        if ($item.attr("showColumnsMenu") == undefined)
            $item.attr("showColumnsMenu", "true");

    });

    //设置页面的window默认值
    $(".mini-window").each(function () {
        var $item = $(this);
        $item.attr("showmodal", true);
        $item.attr("allowresize", false);
        $item.attr("allowdrag", true);
    });

    //全部按钮plain设置为true
    $(".mini-button").each(function () {
        var $item = $(this);
        if ($item.attr("plain") == undefined)
            $item.attr("plain", true);
    });

    //字段编辑权限
    if (typeof (readonlyControl) != "undefined" && readonlyControl != "") {
        var arr = readonlyControl.split(',');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == "")
                continue;
            //容器
            $("#" + arr[i]).attr("readonly", "true").addClass("asLabel");
            $("#" + arr[i]).find("input").each(function (index, item) { $(item).attr("readonly", "true"); });

            //表单字段
            $("input[name='" + arr[i] + "']").attr("readonly", "true").addClass("asLabel");
            $("div[name='" + arr[i] + "']").attr("readonly", "true").addClass("asLabel");

            //列表Field
            if (arr[i].split('.').length = 2)
                $("#" + arr[i].split('.')[0] + " div[field='" + arr[i].split('.')[1] + "']").attr("readonly", "true").addClass("asLabel");
        }
    }
    if (typeof (editableControl) != "undefined" && editableControl != "") {
        var arr = editableControl.split(',');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == "")
                continue;
            //容器
            $("#" + arr[i]).removeAttr("readonly").removeClass("asLabel");
            $("#" + arr[i]).find("input").each(function (index, item) { $(item).removeAttr("readonly"); });

            //表单字段
            $("input[name='" + arr[i] + "']").removeAttr("readonly").removeClass("asLabel");
            $("div[name='" + arr[i] + "']").removeAttr("readonly").removeClass("asLabel");

            //列表Field
            if (arr[i].split('.').length = 2)
                $("#" + arr[i].split('.')[0] + " div[field='" + arr[i].split('.')[1] + "']").removeAttr("readonly").removeClass("asLabel");
        }
    }

    //按钮字段权限,移除没有权限的控件
    if (typeof (noneAuthControl) != "undefined" && noneAuthControl != "") {
        var arr = noneAuthControl.split(',');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == "")
                continue;
            //按钮或容器
            $("#" + arr[i]).hide();
            //表单字段
            $("input[name='" + arr[i] + "']").hide();
            $("div[name='" + arr[i] + "']").hide();

            //列表Field
            if (arr[i].split('.').length = 2)
                $("#" + arr[i].split('.')[0] + " div[field='" + arr[i].split('.')[1] + "']").remove(); //hide对miniui的grid不起作用
        }
    }
    if (typeof (hasAuthControl) != "undefined" && hasAuthControl != "") {
        var arr = hasAuthControl.split(',');
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == "")
                continue;
            //按钮或容器
            $("#" + arr[i]).show();
            //表单字段
            $("input[name='" + arr[i] + "']").show();
            $("div[name='" + arr[i] + "']").show();

            //列表Field
            if (arr[i].split('.').length = 2)
                $("#" + arr[i].split('.')[0] + " div[field='" + arr[i].split('.')[1] + "']").show();
        }
    }

    $("html").append('<span style="display:none;"><input id="btnUploadifive" type="file" name="btnUploadifive" /></span>');

    mini.parse();

    //临时性调整edit的表头固定的layout的滚轴处理
    var _layC = $(".mini-layout-region-body > div");
    _layC.each(function (i, n) { if (n.id == "formlayout") $(n).css("width", "96%"); });

    pageInit();


    if (instantSave) {
        var $form = $("#" + normalParamSettings.formId);
        $form.find('input').each(function (index, e) {
            var name = $(this).attr("name");
            if (name != undefined) {
                var field = mini.getbyName(name);
                if (name != "" && $.cookie != undefined && $.cookie(name) != "" && $.cookie(name) != undefined) {
                    field.setValue($.cookie(name).split(';')[0]);
                    if ($.cookie(name).split(';')[1] != "")
                        field.setText($.cookie(name).split(';')[1]);
                    $.removeCookie(name);
                }
            }
        });
        $form.find('textarea').each(function (index, e) {
            var name = $(this).attr("name");
            if (typeof (KindEditor) != "undefined") {
                var arrTxtAreas = $("textarea.KindEditor");
                $.each(arrTxtAreas, function (i, obj) {
                    if (name == arrTxtAreas[i].name) {
                        if (name != "" && $.cookie != undefined && $.cookie(name) != "" && $.cookie(name) != undefined) {
                            arrTxtAreas[i].textContent = $.cookie(name).split(',')[0];
                        }
                    }
                });
            }
        });

    }

    //列表个性化设置功能
    var grids = $(".mini-datagrid").get();
    for (var i = 0; i < grids.length; i++) {
        var grid = mini.get(grids[i].id);
        //1.从localstorage加载个性化设置
        var _tmplCode = getQueryString("tmplcode");
        var key = window.location.pathname + "/" + _tmplCode + "|" + grids[i].id + "|";
        var _topColumns, _botColumns, _botCols;
        if (typeof (Storage) != "undefined" && localStorage.getItem(key + "top")) {
            _topColumns = mini.decode(localStorage.getItem(key + "top"));
            _botColumns = mini.decode(localStorage.getItem(key + "bottom"));
            if (_topColumns) {
                var _cols = grid.getColumns();
                _botCols = grid.getBottomColumns().map(function (val, idx) {
                    return { "field": val.field, "visible": val.visible };
                });//数组对象深度clone
                var _adjustCols = _storageInitListLoop(_cols, _topColumns, _botColumns, true);

                grid.setColumns(_adjustCols);
            }
        }
        //2.初始化自定义菜单
        new ColumnsContextMenu(grid, _botCols);
    }

    function _storageInitListLoop(currCols, customCols, customBottomCols, isTop) {
        if (!customCols)
            return currCols;

        if (currCols && currCols.length>0)
        {
            for (var i = 0; i < currCols.length; i++) {
                var _flag = (currCols[i].field) ? currCols[i].field : currCols[i].header;
                if(_flag)
                {
                    var customResult = (isTop)?customCols:customBottomCols;
                    for (var j = 0; j < customResult.length; j++) {
                        if (_flag && _flag == customResult[j].field) {
                            $.extend(currCols[i], customResult[j]);
                            break;
                        }
                    }
                    //判断是否有下级，递归
                    if (currCols[i].columns && currCols[i].columns.length > 1)
                    {
                        var _botCols = currCols[i].columns;
                        currCols[i].columns = _storageInitListLoop(_botCols, customCols, customBottomCols, false);
                    }
                }
            }
            currCols.sort(function (a, b) {
                return (a.sortIndex - b.sortIndex);
            });
        }
        
        return currCols;
    }
}



var formData; //add for data

function pageInit() {
    if (alreadyInit)
        return;
    alreadyInit = true;

    //初始化金格电子签名
    var formId = getQueryString("ID");
    if (typeof (Flow_JinGeDesign) != "undefined" && Flow_JinGeDesign == "True" && formId && jQuery(".mini-auditsign").length > 0) {

        Signature.init({//初始化属性
            clientConfig: {//初始化客户端参数
                'SOFTTYPE': '0'//0为：标准版， 1：网络版
            },
            valid: false,    //签章和证书有效期判断， 缺省不做判断
            icon_move: false, //移动签章按钮隐藏显示，缺省显示
            icon_remove: false, //撤销签章按钮隐藏显示，缺省显示
            icon_sign: false, //数字签名按钮隐藏显示，缺省显示
            icon_signverify: false, //签名验证按钮隐藏显示，缺省显示
            icon_sealinfo: false, //签章验证按钮隐藏显示，缺省显示
            certType: 'client',//设置证书在签章服务器
            sealType: 'client',//设置印章从签章服务器取
            documentid: 'KG2016093001',//设置文档ID
            documentname: '测试文档KG2016093001',//设置文档名称
            pw_timeout: 's1800' //s：秒；h:小时；d:天
        });

        jQuery.ajax({
            url: "/MvcConfig/UI/JinGeSign/GetSignList?FormId=" + formId,
            type: "post",
            success: function (text, textStatus) {
                //增加新版报错分支
                if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                    var fail = jQuery.parseJSON(text);
                    var msg = getErrorFromHtml(fail.errmsg);
                    msgUI(msg, 4);
                    return;
                }

                var signs = mini.decode(text);
                Signature.loadSignatures(signs);
                Signature.bind({
                    remove: function (fn) {//签章数据撤销时，将回调此方法，需要实现签章数据持久化（保存数据到后台数据库）,
                        //console.log('获取删除的签章ID：' + this.getSignatureid());
                        fn(true); //保存成功后必须回调fn(true/false)传入true/false分别表示保存成功和失败

                    },
                    update: function (fn) {//签章数据有变动时，将回调此方法，需要实现签章数据持久化（保存数据到后台数据库）,执行后必须回调fn(true/false)，传入true/false分别表示保存成功和失败
                        //console.log('获取更新的签章ID：' + this.getSignatureid());
                        //console.log('获取更新的签章数据：' + this.getSignatureData());
                        fn(true);
                    }
                });


                for (var i = 0; i < signs.length; i++) {

                    $("#" + signs[i]["signUserId"]).html("");
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });

    }


    //地址栏中文参数问题（桂林工程的组织机构数据导入后，组织ID带中文出现乱码问题）
    jQuery(document).ajaxSend(function (event, request, options) {
        options.url = unescape(options.url);
        //alert(options.url);
        options.url = decodeURI(options.url);
        //alert(options.url);
        options.url = encodeURI(options.url);
        //alert(options.url);
        //基准方中项目组织ID里带+号，统一处理
        options.url = options.url.replace(/\+/g, function (e) {
            return "%2B";
        });
    });

    if (getQueryString("FuncType").toLowerCase() == "view") {
        if (getQueryString("TaskExecID") == "") {
            //toolbar改为只隐藏第一个td 2017-3-7 （中石化环保-张文华的修改请求，此修改需要其它项目验证）
            $(".mini-toolbar").each(function () {
                var eles = $(this).find("td");
                if (eles.length > 1) {
                    eles[0].innerHTML = "&nbsp";
                }
                else {
                    $(this).hide();
                }
            });

        }

        setFormDisabled(); //设置表单为只读
        var ss = $(".mini-layout:has(#north .mini-toolbar)"); //查布局控件下必须有在north区域的toolbar，定位固定表头，隐藏高度
        if (ss.length > 0 && ss[0].id)
            mini.get(ss[0].id).hideRegion("north");
    }


    //调用界面的pageLoad方法
    if (typeof (pageLoad) != "undefined")
        pageLoad();
    if ($("#" + normalParamSettings.formId).length == 1) {
        if (!allowUrlOpenForm && window.parent == window) { //禁止从地址栏直接打开
            $(".mini-button").hide();
            alert("不能从地址栏直接打开页面，窗口将关闭！");
            closeWindow();
            return;
        }

        //流程的表单控制
        flowFormControl();


        var $form = $("#" + normalParamSettings.formId);
        if ($form.attr("autogetdata") != "false") {  //如果不自动获取表单数据则直接退出方法

            var formUrl = "GetModel";
            if ($form.attr("url") != undefined)
                formUrl = $form.attr("url");
            formUrl = changeToFullUrl(formUrl); //url转换为全路径
            formUrl = addUrlSearch(formUrl); //url增加当前地址栏参数
            //加载Form数据
            var form = new mini.Form("#" + normalParamSettings.formId);

            $.ajax({
                url: formUrl,
                type: "post",
                cache: false,
                success: function (text) {
                    //增加新版报错分支
                    if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                        var fail = jQuery.parseJSON(text);
                        var msg = getErrorFromHtml(fail.errmsg);
                        msgUI(msg, 4);
                        return;
                    }
                    var data = mini.decode(text);
                    if (data) {
                        formData = data; //add for data

                        //设置表单数据
                        form.setData(data);
                        form.setChanged(false);

                        //解决combobox的BUG
                        var fields = form.getFields();
                        for (var i = 0; i < fields.length; i++) {
                            var field = fields[i];
                            if (field.type == "combobox") {
                                var v = field.getValue();
                                var t = field.getText();
                                if (t == "")
                                    field.setText(v);
                            }
                        }

                        //富文本框赋初始值
                        if (typeof (KindEditor) != "undefined") {
                            var arrTxtAreas = $("textarea.KindEditor");
                            if (arrTxtAreas.length == KindEditor.instances.length) {
                                $.each(arrTxtAreas, function (i, obj) {
                                    KindEditor.instances[i].html($.trim(data[$(obj).attr("name")]));
                                });
                            }
                        }

                    }

                    //将地址栏参数赋值给form的空值隐藏控件
                    $("#" + normalParamSettings.formId).find(".mini-hidden").each(function () {
                        var name = $(this).attr("name");
                        if (hasQueryString(name)) {
                            var field = mini.getbyName(name);
                            if (field.getValue() == "")
                                field.setValue(getQueryString(name));
                        }
                    });

                    //大字段赋值给Grid
                    $("form .mini-datagrid").each(function () {
                        var id = $(this).attr("id");
                        if ((data || 0)[id] != undefined)
                            mini.get(id).setData(mini.decode(data[id]));
                    });
                    $("form .mini-treegrid").each(function () {
                        var id = $(this).attr("id");
                        if ((data || 0)[id] != undefined)
                            mini.get(id).setData(mini.decode(data[id]));
                    });
                    //大字段赋值给Tree
                    $("form .mini-tree").each(function () {
                        var id = $(this).attr("id");
                        if ((data || 0)[id] != undefined)
                            mini.get(id).setData(mini.decode(data[id]));
                    });

                    //调用界面上的onFormSetValue方法
                    if (typeof (onFormSetData) != "undefined")
                        onFormSetData(data);

                    //流程：加载FlowBar
                    var flowMenubar = mini.get("flowMenubar");
                    if (flowMenubar != undefined) {
                        flowLoadMenubar(new mini.Form("#" + normalParamSettings.formId).getData());
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var msg = getErrorFromHtml(jqXHR.responseText);
                    if (msg) {
                        msgUI(msg, 4, function (act) {

                        });
                    }

                }
            });

        }
    }

    //加载Grid
    $(".mini-datagrid").each(function () {
        var grid = mini.get("#" + $(this).attr("id"));

        grid.on("loaderror", function (e) {
            var msg = getErrorFromHtml(e.errorMsg);
            if (msg)
                msgUI(msg, 4);
        });


        //修正首次没有排序的错误
        if (gridSortFields[grid.id]) {
            grid.sortField = gridSortFields[grid.id];
        }
        if (gridSortOrder[grid.id]) {
            grid.sortOrder = gridSortOrder[grid.id];
        }

        //纠正小写ID的错误
        if (grid.idField == "id")
            grid.idField = "ID";
        //TODO:设置grid属性值

        //加载grid
        //dataGrid autoLoad 属性默认为false 
        if (grid.url && gridAutoLoad[grid.id]) {
            grid.setUrl(decodeURI(addUrlSearch(grid.url))); //url增加当前地址栏参数           
            grid.reload();
        }
    });

    $(".mini-treegrid").each(function () {
        var grid = mini.get("#" + $(this).attr("id"));

        grid.on("loaderror", function (e) {
            var msg = getErrorFromHtml(e.errorMsg);
            if (msg)
                msgUI(msg, 4);
        });


        //修正首次没有排序的错误
        if (gridSortFields[grid.id]) {
            grid.sortField = gridSortFields[grid.id];
        }
        if (gridSortOrder[grid.id]) {
            grid.sortOrder = gridSortOrder[grid.id];
        }

        //纠正小写ID的错误
        if (grid.idField == "id")
            grid.idField = "ID";
        if (grid.url) {
            grid.setUrl(decodeURI(addUrlSearch(grid.url))); //url增加当前地址栏参数           
            grid.reload();
        }
    });

    //$("input[readonly='']").attr("UNSELECTABLE", "on"); //IE下，只读控件不要光标，IE8和IE9有性能问题，注释掉
    //    $("input[readonly='']").on({ focus: function () { this.blur(); } });
    //    $("textarea[readonly='']").on({ focus: function () { this.blur(); } });
}


/*---------------------------------------------------------页面加载过程结束----------------------------------------------------*/

function clearDataForm(normalSettings) {
    var settings = $.extend(true, {}, normalParamSettings, normalSettings);
    var form = new mini.Form("#" + settings.formId);
    form.clear();
}

function clearQueryForm(normalSettings) {
    var settings = $.extend(true, {}, normalParamSettings, normalSettings);
    var form = new mini.Form("#" + settings.queryFormId);
    form.clear();
}

function search(normalSettings) {
    var settings = $.extend(true, {}, normalParamSettings, normalSettings);
    var form;
    if ($("#" + settings.queryWindowId).find("form").length > 0) {

        var _formId = $("#" + settings.queryWindowId).find("form").attr("id");
        form = new mini.Form("#" + _formId);
    }
    else {
        form = new mini.Form("#queryForm");
    }
    var grid = mini.get("#" + settings.gridId);
    var quickSearchData = {};
    var keyCo = mini.get(settings.queryBoxId);
    if (keyCo && settings.searchFields) {
        var keys = settings.searchFields.split(',');
        for (i = 0, len = keys.length; i < len; i++) {
            quickSearchData["$IL$" + keys[i]] = keyCo.getValue();
        }
    }

    var data = {};
    form.validate();
    if (form.isValid() == false) return;
    data = form.getData();
    if (grid != undefined)
        grid.load({ queryFormData: mini.encode(data), quickQueryFormData: mini.encode(quickSearchData) });

    if ($("#" + settings.queryWindowId).find("form").length > 0) {
        if (settings.queryWindowId)
            hideWindow(settings.queryWindowId);
    }
}

function quickSearch(searchFields, normalSettings) {
    var settings = $.extend(true, {}, normalParamSettings, normalSettings);

    var grid = mini.get("#" + settings.gridId);

    var data = {};
    var keyCo = mini.get(settings.queryBoxId);
    if (keyCo == undefined) {
        msgUI("当前快速查询文本框" + settings.queryBoxId + "不存在，请重新检查！", 1);
        return;
    }
    var keys = searchFields.split(',');
    for (i = 0, len = keys.length; i < len; i++) {
        data["$IL$" + keys[i]] = keyCo.getValue();
    }
    //data["IsOrRelation"] = "True"; //快速查询条件间为或关系

    if (grid != undefined)
        grid.load({ quickQueryFormData: mini.encode(data) });
}

function add(windowSettings) {
    windowSettings = $.extend(true, {}, windowSettings);
    if (windowSettings.title == undefined)
        windowSettings.title = "增加" + listConfig.title;
    if (windowSettings.url == undefined)
        windowSettings.url = "Edit";

    var settings = $.extend(true, {}, windowParamSettings, listConfig, windowSettings);

    if (settings["createId"] == true || settings["isAutoId"] == true) {
        var url = changeToFullUrl("GetGuid");
        jQuery.ajax({
            url: url,
            type: "post",
            data: "",
            cache: false,
            async: settings.async,
            success: function (text, textStatus) {
                //增加新版报错分支
                if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                    var fail = jQuery.parseJSON(text);
                    var msg = getErrorFromHtml(fail.errmsg);
                    msgUI(msg, 4);
                    return;
                }
                if (settings.url.indexOf('?') > 0)
                    settings.url += "&ID=" + text;
                else
                    settings.url += "?ID=" + text;
                openWindow(settings.url, settings);
            }
        });
    }
    else
        openWindow(settings.url, settings);
}

function edit(windowSettings) {

    windowSettings = $.extend(true, {}, windowSettings);
    if (windowSettings.title == undefined)
        windowSettings.title = "编辑" + listConfig.title;
    if (windowSettings.url == undefined)
        windowSettings.url = "Edit";
    if (windowSettings.mustSelectOneRow == undefined)
        windowSettings.mustSelectOneRow = true;

    windowSettings.url = addSearch(windowSettings.url, "ID", "{ID}");

    var settings = $.extend(true, {}, windowParamSettings, listConfig, windowSettings);

    openWindow(settings.url, settings);
}

function view(windowSettings) {
    windowSettings = $.extend(true, {}, windowSettings);
    if (windowSettings.title == undefined)
        windowSettings.title = "查看" + listConfig.title;
    if (windowSettings.url == undefined)
        windowSettings.url = "Edit";
    if (windowSettings.mustSelectOneRow == undefined)
        windowSettings.mustSelectOneRow = true;
    if (windowSettings.funcType == undefined)
        windowSettings.funcType = "view";
    windowSettings.url = addSearch(windowSettings.url, "ID", "{ID}");

    var settings = $.extend(true, {}, windowParamSettings, listConfig, windowSettings);

    openWindow(settings.url, settings);
}


function del(execSettings) {
    execSettings = $.extend(true, {}, execSettings);
    if (execSettings.action == undefined)
        execSettings.action = "Delete";
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "删除";
    if (execSettings.mustSelectRow == undefined)
        execSettings.mustSelectRow = true;
    if (execSettings.mustConfirm == undefined)
        execSettings.mustConfirm = true;
    if (execSettings.validateForm == undefined)
        execSettings.validateForm = false;

    var settings = $.extend(true, {}, executeParamSettings, execSettings);

    execute(settings.action, settings);
}

function save(execSettings) {
    execSettings = $.extend(true, {}, execSettings);
    if (execSettings.action == undefined)
        execSettings.action = "Save";
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "保存";
    if (execSettings.closeWindow == undefined)
        execSettings.closeWindow = true;
    var settings = $.extend(true, executeParamSettings, { showLoading: true }, execSettings);

    execute(settings.action, settings);
}

function saveList(execSettings) {
    execSettings = $.extend(true, {}, execSettings);
    if (execSettings.action == undefined)
        execSettings.action = "SaveList";
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "保存";

    var settings = $.extend(true, {}, executeParamSettings, execSettings);
    var grid = mini.get(settings.gridId);
    errorTexts = [];
    var valid = true;
    if (grid && grid.allowCellEdit) {
        grid.validate();
        if (grid.isValid() == false) {
            var error = grid.getCellErrors()[0];
            var txt = error.errorText;
            if (error.column.header)
                txt = error.column.header + "：" + txt;
            errorTexts.push(txt);
            valid = false;
        }
    }
    if (!valid) {
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
    execute(settings.action, settings);
}

function saveSortedList(execSettings) {
    execSettings = $.extend(true, {}, execSettings);
    if (execSettings.action == undefined)
        execSettings.action = "SaveSortedList";
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "保存";
    var settings = $.extend(true, {}, executeParamSettings, execSettings);
    var grid = mini.get(settings.gridId);
    errorTexts = [];
    var valid = true;
    if (grid && grid.allowCellEdit) {
        grid.validate();
        if (grid.isValid() == false) {
            var error = grid.getCellErrors()[0];
            var txt = error.errorText;
            if (error.column.header)
                txt = error.column.header + "：" + txt;
            errorTexts.push(txt);
            valid = false;
        }
    }
    if (!valid) {
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
    var gridData = grid.getData();
    var removeRowData = grid.getChanges("removed");
    if (typeof (execSettings) != "undefined" && typeof (execSettings.isTreeGrid) != "undefined" && execSettings.isTreeGrid) {
        //把树形列表的数据转换成列表
        gridData = treeGridToGrid(gridData);
        removeRowData = treeGridToGrid(removeRowData);
    }
    addExecuteParam("SortedListData", gridData);
    addExecuteParam("DeletedListData", removeRowData);
    execute(settings.action, settings);
}

var treeGridData = new Array();
function handleTreeGrid(data) {
    if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var isChildren = typeof (data[i].children) != "undefined" && data[i].children.length > 0;
            treeGridData.push(data[i]);
            if (isChildren)
                handleTreeGrid(data[i].children);
        }
    }
}

function treeGridToGrid(data) {
    treeGridData = new Array();
    handleTreeGrid(data);
    for (var i = 0; i < treeGridData.length; i++) {
        delete treeGridData[i].children;
    }
    return treeGridData;
}

function addRow(newRowJson, normalSettings) {
    var settings = $.extend(true, {}, normalParamSettings, normalSettings);
    var dataGrid = mini.get("#" + settings.gridId);
    if (dataGrid == undefined)
        return;
    for (var key in newRowJson) {
        if (newRowJson[key] && typeof (newRowJson[key]) == "string")
            newRowJson[key] = replaceUrl(newRowJson[key], normalSettings);
    }
    if (settings["createId"] == true || settings["isAutoId"] == true) {
        var url = changeToFullUrl("GetGuid");
        jQuery.ajax({
            url: url,
            type: "post",
            data: "",
            cache: false,
            async: settings.async,
            success: function (text, textStatus) {
                //增加新版报错分支
                if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                    var fail = jQuery.parseJSON(text);
                    var msg = getErrorFromHtml(fail.errmsg);
                    msgUI(msg, 4);
                    return;
                }

                newRowJson["ID"] = text;
                if (typeof (normalSettings) != "undefined" && typeof (normalSettings.isTreeGrid) != "undefined" && normalSettings.isTreeGrid) {
                    var node = dataGrid.getSelectedNode();
                    dataGrid.addNode(newRowJson, "add", node);
                } else {
                    if (settings.isLast)
                        dataGrid.addRow(newRowJson);
                    else
                        dataGrid.addRow(newRowJson, 0);
                }
                dataGrid.validateRow(newRowJson);   //加入新行，马上验证新行
            }
        });
    }
    else {
        if (typeof (normalSettings) != "undefined" && typeof (normalSettings.isTreeGrid) != "undefined" && normalSettings.isTreeGrid) {
            var node = dataGrid.getSelectedNode();
            dataGrid.addNode(newRowJson, "add", node);
        } else {
            if (settings.isLast)
                dataGrid.addRow(newRowJson);
            else
                dataGrid.addRow(newRowJson, 0);
        }
        dataGrid.validateRow(newRowJson);   //加入新行，马上验证新行
    }
}

function delRow(normalSettings) {
    var settings = $.extend(true, {}, normalParamSettings, normalSettings);
    var dataGrid = mini.get(settings.gridId);
    if (dataGrid == undefined)
        return;
    if (typeof (normalSettings) != "undefined" && typeof (normalSettings.isTreeGrid) != "undefined" && normalSettings.isTreeGrid) {
        var node = dataGrid.getSelectedNode();
        if (node) {
            dataGrid.removeNode(node);
        }
    } else {
        var rows = dataGrid.getSelecteds();
        if (rows.length > 0) {
            dataGrid.removeRows(rows, true);
        }
    }
}

function moveNode(execSettings) {
    execSettings = $.extend(true, {}, execSettings);
    if (execSettings.action == undefined)
        execSettings.action = "MoveNode";
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "层级移动";
    if (execSettings.mustSelectRow == undefined)
        execSettings.mustSelectRow = true;
    if (execSettings.mustConfirm == undefined)
        execSettings.mustConfirm = true;
    if (execSettings.validateForm == undefined)
        execSettings.validateForm = false;

    var settings = $.extend(true, {}, executeParamSettings, execSettings);
    var dataGrid = mini.get("#" + settings.gridId);
    if (dataGrid == undefined)
        return;
    var data = treeGridToGrid(dataGrid.getData());
    addExecuteParam("MoveType", "level");
    addExecuteParam("ListData", data);
    execute(settings.action, settings);
}

function moveLeftNode(execSettings) {

    execSettings = $.extend(true, {}, execSettings);
    if (execSettings.action == undefined)
        execSettings.action = "MoveNode";
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "向左移";
    if (execSettings.mustSelectRow == undefined)
        execSettings.mustSelectRow = true;
    if (execSettings.mustConfirm == undefined)
        execSettings.mustConfirm = true;
    if (execSettings.validateForm == undefined)
        execSettings.validateForm = false;

    var settings = $.extend(true, {}, executeParamSettings, execSettings);
    var dataGrid = mini.get("#" + settings.gridId);
    if (dataGrid == undefined)
        return;
    var data = treeGridToGrid(dataGrid.getData());
    addExecuteParam("MoveType", "left");
    addExecuteParam("ListData", data);
    execute(settings.action, settings);
}

function moveRightNode(execSettings) {
    execSettings = $.extend(true, {}, execSettings);
    if (execSettings.action == undefined)
        execSettings.action = "MoveNode";
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "向右移";
    if (execSettings.mustSelectRow == undefined)
        execSettings.mustSelectRow = true;
    if (execSettings.mustConfirm == undefined)
        execSettings.mustConfirm = true;
    if (execSettings.validateForm == undefined)
        execSettings.validateForm = false;

    var settings = $.extend(true, {}, executeParamSettings, execSettings);
    var dataGrid = mini.get("#" + settings.gridId);
    if (dataGrid == undefined)
        return;
    var data = treeGridToGrid(dataGrid.getData());
    addExecuteParam("MoveType", "right");
    addExecuteParam("ListData", data);
    execute(settings.action, settings);
}

/*---------------------------------------------------------Tree方法开始----------------------------------------------------*/

function saveNode(execSettings) {
    execSettings = $.extend(true, {}, execSettings);
    if (execSettings.action == undefined)
        execSettings.action = "SaveNode";
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "保存";
    if (execSettings.onComplete == undefined)
        execSettings.onComplete = returnForm;

    var settings = $.extend(true, {}, executeParamSettings, execSettings);

    execute(settings.action, settings);
}

function searchTree(normalSettings) {

    var settings = $.extend(true, {}, normalParamSettings, normalSettings);

    var tree = mini.get(settings.treeId);
    var key = mini.get(settings.queryTreeBoxId).getValue();
    if (key == "") {
        tree.clearFilter();
    } else {
        tree.filter(function (node) {
            var text = node[tree.textField];
            var isleaf = tree.isLeaf(node);
            if (text.indexOf(key) != -1) {
                return true;
            }
        });

        // 展开所有
        tree.expandAll();
    }
}

function nodeViewing(windowSettings) {
    windowSettings = $.extend(true, {}, windowSettings);
    if (windowSettings.title == undefined)
        windowSettings.title = "查看" + treeConfig.title;
    if (windowSettings.url == undefined)
        windowSettings.url = "NodeEdit";
    if (windowSettings.mustSelectNode == undefined)
        windowSettings.mustSelectNode = true;
    if (windowSettings.funcType == undefined)
        windowSettings.funcType = "view";
    if (windowSettings.paramFrom == undefined)
        windowSettings.paramFrom = "dataTree";

    windowSettings.url = addSearch(windowSettings.url, "ID", "{ID}");

    var settings = $.extend(true, {}, windowParamSettings, treeConfig, windowSettings);

    openWindow(settings.url, settings);
}

function nodeEditing(windowSettings) {
    windowSettings = $.extend(true, {}, windowSettings);
    if (windowSettings.title == undefined)
        windowSettings.title = "编辑" + treeConfig.title;
    if (windowSettings.url == undefined)
        windowSettings.url = "NodeEdit";
    if (windowSettings.mustSelectNode == undefined)
        windowSettings.mustSelectNode = true;
    if (windowSettings.onDestroy == undefined)
        windowSettings.onDestroy = nodeEdited;
    if (windowSettings.paramFrom == undefined)
        windowSettings.paramFrom = "dataTree";

    windowSettings.url = addSearch(windowSettings.url, "ID", "{ID}");

    var settings = $.extend(true, {}, windowParamSettings, treeConfig, windowSettings);

    openWindow(settings.url, settings);
}

function nodeEdited(data, windowSettings) {
    if (typeof (data) != "object")
        return;
    var tree = mini.get(windowSettings.treeId);
    var node;
    if (tree.showCheckBox)
        node = tree.getCheckedNodes()[0];
    else
        node = tree.getSelectedNode();
    tree.updateNode(node, data);
}

function nodeAdding(windowSettings) {
    windowSettings = $.extend(true, {}, windowSettings);
    if (windowSettings.title == undefined)
        windowSettings.title = "增加" + treeConfig.title;
    if (windowSettings.url == undefined)
        windowSettings.url = "NodeEdit";
    if (windowSettings.mustSelectNode == undefined)
        windowSettings.mustSelectNode = true;
    if (windowSettings.onDestroy == undefined)
        windowSettings.onDestroy = nodeAdded;
    if (windowSettings.paramFrom == undefined)
        windowSettings.paramFrom = "dataTree";

    windowSettings.url = addSearch(windowSettings.url, "ParentID", "{ID}");
    windowSettings.url = addSearch(windowSettings.url, "FullID", "{FullID}");


    var settings = $.extend(true, {}, windowParamSettings, treeConfig, windowSettings);

    openWindow(settings.url, settings);
}

function nodeAdded(data, windowSettings) {
    if (typeof (data) != "object")
        return;
    var tree = mini.get(windowSettings.treeId);

    var node;
    if (tree.showCheckBox)
        node = tree.getCheckedNodes()[0];
    else
        node = tree.getSelectedNode();

    tree.addNode(data, "add", node);
    tree.expandNode(node);
}

function nodeDeleting(execSetting) {
    execSetting = $.extend(true, { mustConfirm: true }, execSetting);
    if (execSetting.action == undefined)
        execSetting.action = "DeleteNode";
    if (execSetting.actionTitle == undefined)
        execSetting.actionTitle = "删除";
    if (execSetting.mustSelectNode == undefined)
        execSetting.mustSelectNode = true;
    if (execSetting.mustConfirm == undefined)
        execSetting.mustConfirm = true;
    if (execSetting.onComplete == undefined)
        execSetting.onComplete = nodeDeleted;
    if (execSetting.paramFrom == undefined)
        execSetting.paramFrom = "dataTree";

    execSetting.action = addSearch(execSetting.action, "FullID", "{FullID}");

    var settings = $.extend(true, {}, executeParamSettings, execSetting);

    execute(settings.action, settings);
}

function nodeCopying(execSetting) {
    execSetting = $.extend(true, {}, execSetting);
    msgUI("确认要复制节点吗？", 2, function (action) {
        if (action == "ok") {
            $.removeCookie(ncKey);
            $.cookie(ncKey, replaceUrl(execSetting.url, execSetting), { expires: 1800 });
        }
    });
}

function nodePasting(execSetting) {
    execSetting = $.extend(true, {}, windowParamSettings, treeConfig, execSetting);
    if ($.cookie(ncKey) != undefined) {
        msgUI("确认要粘贴节点吗？", 2, function (action) {
            if (action == "ok") {
                var url = replaceUrl(changeToFullUrl(execSetting.url) + '&cp=' + $.cookie(ncKey), execSetting); //url转化为全路径  
                execute(url, {
                    onComplete: function (result) {
                        var tree = mini.get(execSetting.treeId);
                        tree.reload();
                    },
                    onError: function (data) {
                    }
                });

            }
        });

    }
}


function nodeDeleted(data, execSettings) {
    var tree = mini.get(execSettings.treeId);

    var node;
    if (tree.showCheckBox)
        node = tree.getCheckedNodes()[0];
    else
        node = tree.getSelectedNode();

    tree.removeNode(node);
}

function onNodeDroping(e) {
    //不能拖放到非同级节点的前后
    if ((e.effect == "before" || e.effect == "after") && e.targetNode.ParentID != e.node.ParentID)
        e.effect = "no";
}

function onNodeDrop(e) {
    addExecuteParam("dragNode", mini.encode(e.dragNode));
    addExecuteParam("dropNode", mini.encode(e.dropNode));
    addExecuteParam("dragAction", e.dragAction);
    execute("DropNode", { validateForm: false });
}

//关联数据选择,windowSetting默认fullRelation为false
function relationAppending(url, windowSettings) {
    windowSettings = $.extend(true, {}, windowSettings);
    if (windowSettings.title == undefined)
        windowSettings.title = "选择";
    if (windowSettings.mustSelectNode == undefined)
        windowSettings.mustSelectNode = true;
    if (windowSettings.onDestroy == undefined)
        windowSettings.onDestroy = relationAppended;
    if (windowSettings.paramFrom == undefined)
        windowSettings.paramFrom = "dataTree";
    if (windowSettings.action == undefined)
        windowSettings.action = "AppendRelation";
    if (windowSettings.actionTitle == undefined)
        windowSettings.actionTitle = "保存";


    var windowSettings = $.extend(true, {}, relationConfig, windowSettings);
    windowSettings.addQueryString = false;
    openWindow(url, windowSettings);
}

//关联数据选择完成
function relationAppended(data, settings) {
    if (data == undefined || data == "close" || data.length == 0)
        return;
    settings = $.extend(true, {}, executeParamSettings, settings);
    var node;
    if (settings.isGrid)
        node = mini.get(settings.gridId).getSelected();
    else
        node = mini.get(settings.treeId).getSelectedNode();

    addExecuteParam("NodeFullID", node.FullID);
    addExecuteParam("RelationData", mini.encode(data));
    addExecuteParam("FullRelation", settings.fullRelation);

    execute(settings.action, settings);
}

//关联数据选择,windowSetting默认fullRelation为false
function relationSetting(url, windowSettings) {
    windowSettings = $.extend(true, {}, windowSettings);
    if (windowSettings.title == undefined)
        windowSettings.title = "选择";
    if (windowSettings.mustSelectNode == undefined)
        windowSettings.mustSelectNode = true;
    if (windowSettings.onDestroy == undefined)
        windowSettings.onDestroy = relationSet;
    if (windowSettings.paramFrom == undefined)
        windowSettings.paramFrom = "dataTree";
    if (windowSettings.action == undefined)
        windowSettings.action = "SetRelation";
    if (windowSettings.actionTitle == undefined)
        windowSettings.actionTitle = "保存";

    var windowSettings = $.extend(true, {}, relationConfig, windowSettings);

    openWindow(url, windowSettings);
}

//关联数据选择完成
function relationSet(data, settings) {
    if (data == undefined || data == "close")
        return;

    settings = $.extend(true, {}, executeParamSettings, settings);
    var node = mini.get(settings.treeId).getSelectedNode();

    addExecuteParam("NodeFullID", node.FullID);
    addExecuteParam("RelationData", mini.encode(data));
    addExecuteParam("FullRelation", settings.fullRelation);

    execute(settings.action, settings);
}

//关联数据删除，execSettings默认fullRelation为false,execSettings中可以包含参数relationData
function delRelation(execSettings) {
    execSettings = $.extend({ fullRelation: false }, execSettings);
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "删除";
    if (execSettings.mustConfirm == undefined)
        execSettings.mustConfirm = true;
    if (execSettings.action == undefined)
        execSettings.action = "DeleteRelation";

    execSettings = $.extend(true, {}, executeParamSettings, execSettings);

    if (execSettings.nodeFullID == "") {
        var node = mini.get(execSettings.treeId).getSelectedNode();
        if (node == null) {
            msgUI("当前没有选择要操作的节点，请重新确认！", 1);
            return;
        }
        execSettings.nodeFullID = node.FullID;
    }

    if (execSettings.relationData == "") {
        var rows = mini.get(execSettings.gridId).getSelecteds();
        if (rows.length == 0) {
            msgUI("当前没有选择要操作的记录，请重新确认！", 1);
            return;
        }
        execSettings.relationData = rows;
    }

    addExecuteParam("NodeFullID", execSettings.nodeFullID);
    addExecuteParam("RelationData", mini.encode(execSettings.relationData));
    addExecuteParam("FullRelation", execSettings.fullRelation);


    execute(execSettings.action, execSettings);
}

function addRelationData(windowSettings) {

    windowSettings = $.extend({ fullRelation: false }, windowSettings);
    if (windowSettings.title == undefined)
        windowSettings.title = "增加" + relationConfig.title;
    if (windowSettings.mustSelectNode == undefined)
        windowSettings.mustSelectNode = true;
    if (windowSettings.paramFrom == undefined)
        windowSettings.paramFrom = "dataTree";
    if (windowSettings.url == undefined)
        windowSettings.url = "RelationDataEdit";

    windowSettings = $.extend(true, {}, windowParamSettings, windowSettings);
    var node = mini.get(windowSettings.treeId).getSelectedNode();
    if (node == null) {
        msgUI("当前没有选择要操作的节点，请重新确认！", 1);
        return;
    }

    windowSettings.url = addSearch(windowSettings.url, "NodeFullID", node.FullID);
    windowSettings.url = addSearch(windowSettings.url, "FullRelation", windowSettings.fullRelation);

    var windowSettings = $.extend(true, {}, relationConfig, windowSettings);

    windowSettings.addQueryString = false;

    openWindow(windowSettings.url, windowSettings);
}

function editRelationData(windowSettings) {
    windowSettings = $.extend({ url: "RelationDataEdit" }, windowSettings);

    if (windowSettings.title == undefined)
        windowSettings.title = "编辑" + relationConfig.title;
    if (windowSettings.width == undefined)
        windowSettings.width = relationConfig.width;
    if (windowSettings.height == undefined)
        windowSettings.height = relationConfig.height;
    windowSettings.addQueryString = false;
    edit(windowSettings);
}

function viewRelationData(windowSettings) {
    windowSettings = $.extend({ url: "RelationDataEdit" }, windowSettings);

    if (windowSettings.title == undefined)
        windowSettings.title = "查看" + relationConfig.title;
    if (windowSettings.width == undefined)
        windowSettings.width = relationConfig.width;
    if (windowSettings.height == undefined)
        windowSettings.height = relationConfig.height;
    windowSettings.addQueryString = false;
    view(windowSettings);
}

function saveRelationData(execSettings) {
    execSettings = $.extend(true, {}, execSettings);
    if (execSettings.action == undefined)
        execSettings.action = "SaveRelationData";
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "保存";
    if (execSettings.onComplete == undefined)
        execSettings.onComplete = returnForm;

    var settings = $.extend(true, {}, executeParamSettings, execSettings);

    execute(settings.action, settings);
}

//关联数据删除
function delRelationData(execSettings) {
    execSettings = $.extend(true, {}, execSettings);
    if (execSettings.action == undefined)
        execSettings.action = "DeleteRelationData";
    if (execSettings.actionTitle == undefined)
        execSettings.actionTitle = "删除";
    if (execSettings.mustConfirm == undefined)
        execSettings.mustConfirm = true;
    execSettings = $.extend(true, {}, executeParamSettings, execSettings);

    var node = mini.get(execSettings.treeId).getSelectedNode();
    var relationData = mini.get(execSettings.gridId).getSelecteds();

    if (node == null) {
        msgUI("当前没有选择要操作的节点，请重新确认！", 1);
        return;
    }
    if (relationData.length == 0) {
        msgUI("当前没有选择要操作的记录，请重新确认！", 1);
        return;
    }
    addExecuteParam("RelationData", mini.encode(relationData));
    execute(execSettings.action, execSettings);
}

/*---------------------------------------------------------Tree方法结束----------------------------------------------------*/

/*---------------------------------------------------------选人选部门开始--------------------------------------------------------*/

function returnForm(windowSettings) {
    windowSettings = $.extend(true, {}, windowParamSettings, windowSettings);
    var form = new mini.Form(windowSettings.formId);
    closeWindow(form.getData());
}

function returnList(windowSettings) {
    windowSettings = $.extend(true, {}, windowParamSettings, windowSettings);
    var grid = mini.get(windowSettings.gridId);
    closeWindow(grid.getSelecteds());
}

function addSingleUserSelector(name, selectorSettings) {
    selectorSettings = $.extend({ width: 520, height: 480, selectMode: "single", targetType: "form", allowResize: false }, selectorSettings);
    if (selectorSettings.targetType == "form") {
        var rParams = $.trim(selectorSettings.returnParams);
        if (rParams.length == 0)
            selectorSettings.returnParams = "value:ID,text:Name";
        else
            selectorSettings.returnParams = $.trim(selectorSettings.returnParams);

        addAutoUserSelect(name, selectorSettings);
    }
    var url = urlConstant.singleUser;
    if (selectorSettings.OrgIDs || selectorSettings.RoleIDs || selectorSettings.Aptitude) {
        url = urlConstant.singleScopeUser;
    }
    if (selectorSettings.OrgIDs)
        url = url + "&OrgIDs=" + selectorSettings.OrgIDs;
    if (selectorSettings.RoleIDs)
        url = url + "&RoleIDs=" + selectorSettings.RoleIDs;
    if (selectorSettings.Aptitude)
        url = url + "&Aptitude=" + JSON.stringify(selectorSettings.Aptitude);
    if (selectorSettings.UrlParams)
        url = url + "&" + selectorSettings.UrlParams;
    addSelector(name, url, selectorSettings);
}

function addMultiUserSelector(name, selectorSettings) {
    selectorSettings = $.extend({ width: 750, height: 595, selectMode: "multi", targetType: "form", allowResize: false }, selectorSettings);
    if (selectorSettings.targetType == "form") {
        var rParams = $.trim(selectorSettings.returnParams);
        if (rParams.length == 0)
            selectorSettings.returnParams = "value:ID,text:Name";
        else
            selectorSettings.returnParams = $.trim(selectorSettings.returnParams);

        addAutoUserSelect(name, selectorSettings);
    }
    var url = urlConstant.multiUser;
    if (selectorSettings.OrgIDs || selectorSettings.RoleIDs || selectorSettings.Aptitude)
        url = urlConstant.multiScopeUser;
    if (selectorSettings.OrgIDs)
        url = url + "&OrgIDs=" + selectorSettings.OrgIDs;
    if (selectorSettings.RoleIDs)
        url = url + "&RoleIDs=" + selectorSettings.RoleIDs;
    if (selectorSettings.Aptitude)
        url = url + "&Aptitude=" + JSON.stringify(selectorSettings.Aptitude);
    if (selectorSettings.UrlParams)
        url = url + "&" + selectorSettings.UrlParams;
    addSelector(name, url, selectorSettings);
}

function addSingleOrgSelector(name, selectorSettings) {
    selectorSettings = $.extend({ width: 320, height: 580, allowResize: false }, selectorSettings);
    var url = urlConstant.singleOrg;
    if (selectorSettings.OrgType)
        url += "&OrgType=" + selectorSettings.OrgType;
    if (selectorSettings.UrlParams)
        url = url + "&" + selectorSettings.UrlParams;
    addSelector(name, url, selectorSettings);
}

function addMultiOrgSelector(name, selectorSettings) {
    selectorSettings = $.extend({ width: 320, height: 580, allowResize: false }, selectorSettings);
    var url = urlConstant.multiOrg;
    if (selectorSettings.OrgType)
        url += "&OrgType=" + selectorSettings.OrgType;
    if (selectorSettings.UrlParams)
        url = url + "&" + selectorSettings.UrlParams;
    addSelector(name, url, selectorSettings);
}

function addSingleRoleSelector(name, selectorSettings) {
    selectorSettings = $.extend({ width: 720, height: 580, allowResize: false }, selectorSettings);
    var url = urlConstant.multiRole;
    if (selectorSettings.url)
        url = selectorSettings.url;
    addSelector(name, url, selectorSettings);
}

function addMultiRoleSelector(name, selectorSettings) {
    selectorSettings = $.extend({ width: 720, height: 580, allowResize: false }, selectorSettings);
    var url = urlConstant.multiRole;
    if (selectorSettings.url)
        url = selectorSettings.url;
    addSelector(name, url, selectorSettings);
}
function showHelp() {
    //openWindow('/MvcConfig/UI/Help/PageView?Url=' + escape(window.location.pathname + window.location.search), { title: '页面帮助' });
    window.open('/MvcConfig/UI/Help/PageView?Url=' + escape(window.location.pathname + window.location.search), '页面帮助');
}
/*---------------------------------------------------------选人选部门结束--------------------------------------------------------*/

/*---------------------------------------------------------流程方法开始--------------------------------------------------------*/
//
var flowExecMethod = null;

var flowCode = getQueryString("FlowCode");
//(此方法为私有方法)给Url追加流程编号。（启动流程时，最终确定FlowCode，以便做到表单数据可以改变启动的流程）
function flowUrlAppendFlowCode(url) {

    if (flowCode == "")//当前地址栏没有FlowCode则不追加
        return url;

    if (url.indexOf('?') > 0)
        url += '&';
    else
        url += '?';
    url += "FlowCode=" + flowCode;

    return url;
}


//加载流程菜单条
function flowLoadMenubar(jsonFormData, flowCode) {
    if (flowCode) {
        this.flowCode = flowCode;
    }
    var menubar = mini.get("flowMenubar");
    if (!menubar)
        return;
    menubar.disable();
    if (!jsonFormData)
        jsonFormData = new mini.Form("dataForm").getData();

    var url = flowUrlAppendFlowCode("GetFlowButtons"); //如果存在flowCode则直接追加（流程切换）
    url = changeToFullUrl(url); //url转化为全路径   
    url = addUrlSearch(url); //url增加当前地址栏参数
    $.ajax({
        url: url,
        type: "post",
        data: { formData: mini.encode(jsonFormData) },
        cache: false,
        success: function (text) {
            //增加新版报错分支
            if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                var fail = jQuery.parseJSON(text);
                var msg = getErrorFromHtml(fail.errmsg);
                msgUI(msg, 4);
                return;
            }

            var data = mini.decode(text);
            //防止自己开发的页面没有获取表单信息的情况
            if (formData == undefined || formData == null)
                formData = mini.encode(jsonFormData);
            //表单状态
            var formStatus = formData.FlowPhase;
            if (formStatus == "") formStatus = "未启动";

            if (typeof (FlowPhase) != 'undefined') {//FlowPhase为页面上的流程阶段枚举 
                for (var i = 0; i < FlowPhase.length; i++) {
                    if (FlowPhase[i]["value"] == formStatus) {
                        if (typeof (CurrentLGID) != 'undefined' && CurrentLGID == "EN")
                            formStatus = FlowPhase[i]["value"];
                        else
                            formStatus = FlowPhase[i]["text"];
                    }
                }
                $("#divFormStatus").show();
            }

            $("#spanFormStatus").text(formStatus);
            //升版逻辑           
            if (getQueryString("RelateField") != "") {
                if (getQueryString("AllowUpperVersion") == "true") {
                    data.unshift({ id: "btnUpperVersion", text: "升版", iconCls: "icon-top", onclick: "flowUpperVersion();" });
                    setFormDisabled();
                }

                if (getQueryString('Versions') != "") {
                    var Versions = [];
                    var VersionNumber = 1;
                    var arrs = getQueryString('Versions').split(',');
                    for (var i = 0; i < arrs.length; i++)
                        Versions.push({ value: arrs[i], text: arrs[i] });

                    if (Versions.length > 1) {
                        if (getQueryString('VersionNumber') != "")
                            VersionNumber = getQueryString('VersionNumber');
                        $("#divFormVersion").show();
                        var cmbVersion = mini.get("cmbVersion");
                        cmbVersion.setData(Versions);
                        cmbVersion.setValue(VersionNumber);
                    }
                }



                if (formData.FlowPhase == "End" || formData.FlowPhase == "Processing") {
                    setFormDisabled();
                }

                //如果是funcType=="View" 只保留流程跟踪和导出
                var funcType = getQueryString("FuncType");
                if (funcType && funcType.toLowerCase() == "view") {
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (data[i] && data[i].id != "btnExport" && data[i].id != "btnTrace" && data[i].id != "btnWithdraw")
                            data.remove(data[i]);
                    }
                }
            }
            //超过5个路由按钮（路由按钮都在最前面）
            if (data.length > 5) {
                var isNeedChoose = false;
                for (var i = data.length - 1; i >= 0; i--) {
                    if (data[i].id.indexOf('btn') < 0 || data[i].id.indexOf('btnDoBack') >= 0 || data[i].id.indexOf('btnDelegate') >= 0 || data[i].id.indexOf('btnCirculate') >= 0 || data[i].id.indexOf('btnAsk') >= 0) {
                        data[i].pid = 'select';
                        isNeedChoose = true;
                    }
                }
                if (isNeedChoose)
                    data.unshift({ id: "select", text: "请选择" });
            }



            //固有按钮和流程按钮间增加分隔符
            for (var i = data.length - 1; i >= 0; i--) {
                if (i > 0 && data[i].id.indexOf('btn') >= 0) {
                    data.splice(i, 0, { type: "separator" });
                    break;
                }
            }

            //流程表单按钮再次展示
            var code = getQueryString("FlowCode");
            if (code && funcType != null && funcType != undefined && funcType != ""
                && funcType.toLowerCase() == "view") {
                $(".mini-toolbar").each(function () {
                    var btnID = $(this)[0].id;
                    if (btnID == "btnExport" || btnID == "btnTrace" || btnID == "btnWithdraw")
                        $(this).show();
                });
            }

            //是否显示意见框
            var flag = false;
            for (var i = 0; i < data.length; i++) {
                if (!data[i].id) continue;
                if (data[i].id.indexOf('btn') < 0) { //提交按钮
                    flag = true;
                    break;
                }
                else if (data[i].id == "btnDoBackFirstReturn" || data[i].id == "btnDoBackFirst" || data[i].id == "btnDoBack" || data[i].id == "btnReply" || data[i].id == "btnView") {
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                $("#defaultAdvice").hide();
                mini.getbyName("Advice").hide();
            }
                //环节配置的隐藏意见框
            else if (FlowCurrntStep && FlowCurrntStep.HideAdvice == "1") {
                $("#defaultAdvice").hide();
                mini.getbyName("Advice").hide();
            }
            else {
                mini.getbyName("Advice").show();
            }

            if (!showCustomAdvice)
                $("#defaultAdvice").hide();

            if (typeof (onFlowLoadedMenubar) != 'undefined')
                data = onFlowLoadedMenubar(data);

            menubar.loadList(data, "id", "pid");
            menubar.enable();
            $("#flowBar .mini-menuitem").css("cursor", "pointer");
            $("#flowBar .mini-menuitem-text").css("cursor", "pointer");
            $("#flowBar .mini-menuitem-text").addClass("mini-flow-button");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var msg = jqXHR.responseText.toLowerCase();
            if (msg.indexOf("<title>") > 0) {
                msg = jqXHR.responseText.split('</title>')[0];
                msg = msg.split('<title>')[1];
                msg = msg.replace("<br>", "\r\n");
                msg = msg.replace("<br>", "\r\n");
                msg = msg.replace("<br>", "\r\n");
                msg = msg.replace("<br>", "\r\n");
                msg = msg.replace("<br>", "\r\n");
            }
            if (msg)
                msgUI(msg, 4);
        }
    });

}

//获取grid的Column
function _getGridColumnByField(columns, field) {
    var col = null;
    if (columns != null && columns.length > 0) {
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].field == field) {
                col = columns[i];
                return col;
            }
            else {
                col = _getGridColumnByField(columns[i].columns, field);
                if (col != null)
                    return col;
            }
        }
    }
    return col;
}


//流程的表单控制
function flowFormControl() {

    if (getQueryString("FlowCode") == "" && getQueryString("TaskExecID") == "")
        return;
    //MvcConfig站点只有MvcConfig/UI/Form/PageView使用表单控制
    if (window.location.href.indexOf("MvcConfig") >= 0 && window.location.href.indexOf("MvcConfig/UI/Form/PageView") <= 0)
        return;

    var url = flowUrlAppendFlowCode("GetFormControlInfo"); //如果存在flowCode则直接追加（流程切换）
    url = changeToFullUrl(url); //url转化为全路径   
    url = addUrlSearch(url); //url增加当前地址栏参数
    $.ajax({
        url: url,
        type: "post",
        cache: false,
        error: function (jqXHR, textStatus, errorThrown) {
            msgUI("获取流程控制信息失败：GetFormControlInfo");
        },
        success: function (text) {
            //增加新版报错分支
            if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                var fail = jQuery.parseJSON(text);
                var msg = getErrorFromHtml(fail.errmsg);
                msgUI(msg, 4);
                return;
            }

            var data = mini.decode(text);
            var HiddenElements = data.HiddenElements.split(',');
            var VisibleElements = data.VisibleElements.split(',');
            var EditableElements = data.EditableElements.split(',');
            var DisableElements = data.DisableElements.split(',');

            for (var i = 0; i < HiddenElements.length; i++) {
                var eleKey = HiddenElements[i];

                if (eleKey == "") continue;
                if (eleKey.split('.').length == 2) {
                    var gridId = eleKey.split('.')[0];
                    var gridField = eleKey.split('.')[1];
                    var grid = mini.get(gridId);
                    var col = _getGridColumnByField(grid.columns, gridField);
                    if (col)
                        grid.hideColumn(col);
                }
                else {
                    var obj = mini.getbyName(eleKey);
                    if (!obj)
                        obj = mini.get(eleKey);
                    if (obj) {
                        obj.hide();
                    }
                    else {
                        $("#" + eleKey).hide();
                    }
                }
            }
            for (var i = 0; i < DisableElements.length; i++) {
                var eleKey = DisableElements[i];
                if (eleKey == "") continue;
                if (eleKey.split('.').length == 2) {
                    var gridId = eleKey.split('.')[0];
                    var gridField = eleKey.split('.')[1];
                    var grid = mini.get(gridId);
                    var col = _getGridColumnByField(grid.columns, gridField);
                    if (col)
                        col.readOnly = true;
                }
                else if (eleKey == normalParamSettings.formId)
                    setFormDisabled();
                else {
                    var obj = mini.getbyName(eleKey);
                    if (!obj)
                        obj = mini.get(eleKey);
                    if (obj) {
                        if (obj.type == "datagrid") {
                            obj.setAllowCellEdit(false);
                            obj.setAllowCellSelect(false);
                        }
                        else {
                            var result = true;
                            for (var j = 0; j < VisibleElements.length; j++) {
                                if (VisibleElements[j] == eleKey) {
                                    result = false;
                                }
                            }
                            if (obj.setReadOnly) obj.setReadOnly(true);
                            if (result && (obj.type == 'multifile' || obj.type == 'singlefile')) {
                                //if (obj.setEnabled) obj.setDisabled(true);
                                if (obj.setEnabled) obj.setReadOnly(true);           //流程中的附件控件不可下载
                                if (obj.removeCls) obj.removeCls("asLabel");         //增加asLabel外观
                            } else {
                                if (obj.addCls) obj.addCls("asLabel");         //增加asLabel外观
                            }
                        }
                    }
                    else {
                        $("#" + eleKey).find("[name]").each(function (index) {
                            obj = mini.getbyName($(this).attr("name"));
                            if (obj && obj.setReadOnly) obj.setReadOnly(true);
                            if (obj && obj.addCls) obj.addCls("asLabel");         //增加asLabel外观
                        });
                    }
                }
            }
            for (var i = 0; i < VisibleElements.length; i++) {
                var eleKey = VisibleElements[i];

                if (eleKey == "") continue;
                if (eleKey.split('.').length == 3 && eleKey.split('.')[0] == "tab") {
                    var tabID = eleKey.split('.')[1];
                    var tabName = eleKey.split('.')[2];
                    var tabs = mini.get(tabID);
                    if (tabs) {
                        var tab = tabs.getTab(tabName);
                        if (tab) {
                            tabs.updateTab(tab, { visible: false });
                        }
                    }
                }
                else if (eleKey.split('.').length == 2) {
                    var gridId = eleKey.split('.')[0];
                    var gridField = eleKey.split('.')[1];
                    var grid = mini.get(gridId);
                    var col = _getGridColumnByField(grid.columns, gridField);
                    if (col)
                        grid.showColumn(col);
                }
                else {
                    if (eleKey == "toolbar")
                        $(".mini-toolbar").show();
                    var obj = mini.getbyName(eleKey);
                    if (!obj)
                        obj = mini.get(eleKey);
                    if (obj) {
                        obj.show();
                    }
                    else {
                        $("#" + eleKey).show();
                    }
                }
            }
            for (var i = 0; i < EditableElements.length; i++) {
                var eleKey = EditableElements[i];
                if (eleKey == "") continue;

                if (eleKey.split('.').length == 2) {
                    var gridId = eleKey.split('.')[0];
                    var gridField = eleKey.split('.')[1];
                    var grid = mini.get(gridId);
                    grid.setAllowCellEdit(true);
                    grid.setAllowCellSelect(true);
                    var col = _getGridColumnByField(grid.columns, gridField);
                    if (col)
                        col.readOnly = false;
                }
                else {
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
                    else {
                        $("#" + eleKey).find("[name]").each(function (index) {
                            obj = mini.getbyName($(this).attr("name"));
                            if (obj && obj.setReadOnly) obj.setReadOnly(false);
                            if (obj && obj.setEnabled) obj.setEnabled(true);
                            if (obj && obj.removeCls) obj.removeCls("asLabel");         //增加asLabel外观
                        });
                    }
                }
            }
            //重新计算布局高度等
            mini.layout();

            //$("input[readonly='']").attr("UNSELECTABLE", "on"); //IE下，只读控件不要光标，IE8和IE9有性能问题，注释掉
            //            $("input[readonly='']").on({ focus: function () { this.blur(); } });
            //            $("textarea[readonly='']").on({ focus: function () { this.blur(); } });
        }
    });

    //获取流程意见
    var taskExecID = getQueryString("TaskExecID");
    if (taskExecID) {
        $.ajax({
            url: "GetTaskExec?TaskExecID=" + taskExecID,
            type: "post",
            cache: false,
            error: function (jqXHR, textStatus, errorThrown) {
                msgUI("获取获取流程意见失败：GetTaskExec");
            },
            success: function (text) {
                //增加新版报错分支
                if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                    var fail = jQuery.parseJSON(text);
                    var msg = getErrorFromHtml(fail.errmsg);
                    msgUI(msg, 4);
                    return;
                }

                var data = mini.decode(text);
                mini.getbyName("Advice").setValue(data.ExecComment.replace(/<\/?.+?>/g, ''));
            }
        });
    }
}

function flowValidatePwd(pwd) {
    var result = "";
    jQuery.ajax({
        url: 'ValidatePwd',
        type: "post",
        data: { pwd: pwd },
        cache: false,
        async: false,
        success: function (text, textStatus) {
            //增加新版报错分支
            if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                var fail = jQuery.parseJSON(text);
                var msg = getErrorFromHtml(fail.errmsg);
                msgUI(msg, 4);
                return;
            }
            result = text;
            return result;
        }
    });
    return result;
}

function flowSubmitting(flowRouting) {

    //验证输入
    if (!validateInput()) {
        if (errorTexts.length > 0 && showErrors) {
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


    var advice = mini.getbyName("Advice");

    if (advice.visible == true && advice.getValue().trim() == "") {
        if (flowRouting.mustInputComment == true || flowRouting.id == "btnDoBack" || flowRouting.id == "btnDoBackFirst") {//如果需要输入意见   
            var defaultComment = flowRouting.defaultComment;
            if (!defaultComment) {
                //defaultComment = "同意";
                msgUI("请配置默认意见！");
                return false;
            }
            msgUI("由于您未填写意见，系统将自动默认为" + defaultComment + "，您是否确定？", 2, function (btn) {
                if (btn == "ok") {
                    advice.setValue(defaultComment);
                    flowSubmitting1(flowRouting);
                }
            });
        } else {
            flowSubmitting1(flowRouting);
        }
    }
    else {
        flowSubmitting1(flowRouting);
    }
}

//流程提交方法
var flowRouting; // 流程操作参数
function flowSubmitting1(flowRouting) {
    var fun = function (flowRouting) {
        var notNullFields = flowRouting.notNullFields.split(',');
        for (var i = 0; i < notNullFields.length; i++) {
            if (notNullFields[i] == "")
                continue;
            var ctrl = mini.getbyName(notNullFields[i]);
            if (ctrl && ctrl.setRequired)
                ctrl.setRequired(true);
            else {
                ctrl = mini.get(notNullFields[i]);
                if (ctrl) {
                    if (ctrl.type == "datagrid") { //支持流程的grid必填
                        var rowsCount = ctrl.getData().length;
                        if (rowsCount <= 0) {
                            msgUI(notNullFields[i] + "子表数据不可为空。");
                            return false;
                        }
                    }
                }
            }
        }

        if (notNullFields && notNullFields.length > 0) {
            //验证表单数据
            if (!validateInput()) {
                if (errorTexts.length > 0 && showErrors) {
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
            //var form = new mini.Form("#" + normalParamSettings.formId);
            //form.validate();
            //if (form.isValid() == false) return false;
        }

        if (typeof (onFormSubmitting) != "undefined") {
            if (!onFormSubmitting(flowRouting))
                return;
        }

        this.flowRouting = jQuery.extend(true, {}, flowRouting);

        flowExecUserSelecting();
    };

    if (flowRouting.signatureType == "JinGe") {
        if (typeof (Flow_JinGeAUTHORIZECODE) == "undefined") {
            msgUI("请在web.Config中配置Flow_JinGeAUTHORIZECODE，并将其输出到页面！");
            return;
        }

        Signature.AXI('SetParamByName', 'AUTHORIZECODE', Flow_JinGeAUTHORIZECODE, function (data) {
            if (data) {

                $("body").append('<input type="hidden" id=' + user.UserID + '> ');
                var signatureCreator = Signature.create();

                signatureCreator.run({
                    //protectedItems: ['ID'],//设置定位页面DOM的id，自动查找ID，自动获取保护DOM的kg-desc属性作为保护项描述，value属性为保护数据。不设置，表示不保护数据，签章永远有效。
                    position: user.UserID,//设置盖章定位dom的ID，必须设置
                    okCall: function (fn) {//点击确定后的回调方法，this为签章对象 ,签章数据撤销时，将回调此方法，需要实现签章数据持久化（保存数据到后台数据库）,保存成功后必须回调fn(true/false)渲染签章到页面上
                        var signatureId = this.getSignatureid();
                        var signatureData = this.getSignatureData();
                        addExecuteParam("signatureId", signatureId);
                        addExecuteParam("signatureData", signatureData);
                        fun(flowRouting);
                        fn(true);
                    },
                    cancelCall: function () {//点击取消后的回调方法

                    }
                });
            }
        });

    }
    else if (allowSignPwdValidation && flowRouting.inputSignPwd == "1") {
        mini.open({
            url: signPwdValidationUrl,
            title: '签字密码验证',
            width: '250',
            height: '120',
            ondestroy: function (action) {
                if (action == "ok") {       //如果点击“确定”
                    var iframe = this.getIFrameEl();
                    //获取选中、编辑的结果
                    var data = iframe.contentWindow.getData();
                    if (data == 'false')
                        msgUI("签字密码错误");
                    else
                        fun(flowRouting);
                }
            }
        });
    }
    else {
        fun(flowRouting);
    }
}

var retVal = '';
function popHtml(url, windowSettings) {
    var settings = jQuery.extend(true, {}, {}, windowSettings);
    jQuery.ajax({
        url: url,
        type: "post",
        data: {},
        cache: false,
        async: false,
        success: function (data, textStatus) {
            //增加新版报错分支
            if (data && typeof (data) == "string" && data.indexOf("{\"errcode\"") == 0) {
                msgUI("获取数据失败：" + url);
                return;
            }
            //增加新版报错分支
            if (data.errcode) {
                msgUI("获取数据失败：" + url);
                return;
            }

            if (data.data != undefined)
                data = data.data;
            if (data && data.length > 0) {
                var $divHead = $("<div style='width:" + settings.width + "px;height:230px;'></div>");
                var $tableHead = $("<table class='t1' border='1' width='100%'></table>");
                var $div = $("<div class='scrollbar' style='height:200px; overflow-y:auto;'></div>");
                var $table = $("<table class='t1' border='1' width='100%' style=\"table-layout:fixed;\" ></table>");
                if (settings.parameter.split(',').length > 0) {
                    var $tr1 = $("<thead style='text-align:center;width:100px;' ></thead>");
                    for (var j = 0; j < settings.parameter.split(',').length; j++) {
                        var $td1 = $("<th class='fonttd'></th>").append(settings.parameter.split(',')[j].split(':')[1]);
                        $tr1.append($td1);
                    }
                    $tableHead.append($tr1);
                }
                for (var i = 0; i < data.length; i++) {
                    var $tr = $("<tr></tr>");
                    for (var j = 0; j < settings.parameter.split(',').length; j++) {
                        var value = eval('data[i].' + settings.parameter.split(',')[j].split(':')[0]);
                        var $td = $("<td class='fonttd' title=" + value + "></td>").append(value);
                        $tr.append($td);
                    }
                    $table.append($tr);
                }
                $divHead.append($tableHead).append($div.append($table));
                retVal = $divHead[0].outerHTML;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            msgUI("获取数据失败：" + url);
        }
    });
}
function flowChartSubmitting(flowRouting, left, top) {
    this.flowRouting = jQuery.extend(true, {}, flowRouting);
    var url = "";

    //下一步执行数据取自表单
    if (flowRouting.orgIDFromField != "") {
        if (flowRouting.orgIDFromField.indexOf('{') >= 0) {
            flowRouting.orgIDs = flowRouting.orgIDFromField.replace(/\{[0-9a-zA-Z_\u4e00-\u9faf]*\}/g, function (str) {
                var v = str.substr(1, str.length - 2);
                return mini.getbyName(v).getValue();
            });
        }
        else {
            var orgs = "";
            for (var i = 0; i < flowRouting.orgIDFromField.split(',').length; i++) {
                var item = flowRouting.orgIDFromField.split(',')[i];
                var v = mini.getbyName(item).getValue();
                if (v && flowRouting.orgIDs.indexOf(v) == -1) {
                    orgs += ',' + v;
                }
            }
            flowRouting.orgIDs = orgs != '' ? orgs : flowRouting.orgIDs;
            if (flowRouting.orgIDs && flowRouting.orgIDs.indexOf(',') == 0)
                flowRouting.orgIDs = flowRouting.orgIDs.substr(1);
        }
    }
    if (flowRouting.roleIDsFromField != "") {
        flowRouting.roleIDs = mini.getbyName(flowRouting.roleIDsFromField).getValue();
    }
    if (flowRouting.userIDsFromField != "") {
        var userIDs = flowRouting.userIDs.split(',');
        var fieldIds = flowRouting.userIDsFromField.split(',');
        for (var i = 0; i < fieldIds.length; i++) {
            var ids = mini.getbyName(fieldIds[i]).getValue().split(',');
            for (var j = 0; j < ids.length; j++) {
                if (userIDs.indexOf(ids[j]) < 0) {
                    userIDs.push(ids[j]);
                }
            }
        }
        flowRouting.userIDs = userIDs.join(',');
        if (flowRouting.userIDs.indexOf(',') == 0)
            flowRouting.userIDs = flowRouting.userIDs.substr(1);

    }
    if (flowRouting.userIDsGroupFromField != "") {
        flowRouting.userIDsGroup = mini.getbyName(flowRouting.userIDsGroupFromField).getValue();
    }
    //角色或部门取自表单时,此ajax方法同步执行
    if (flowRouting.orgIDFromField != "" || flowRouting.roleIDsFromField != "") {
        if (this.flowRouting.selectMode != "SelectOneOrg" && this.flowRouting.selectMode != "SelectMultiOrg") {
            var url = "GetUserIDs?roleIDs=" + flowRouting.roleIDs + "&orgIDs=" + flowRouting.orgIDs + "&excludeUserIDs=" + this.flowRouting.excudeUserIDs;
            url = changeToFullUrl(url);
            jQuery.ajax({
                url: url,
                type: "post",
                data: {},
                cache: false,
                async: false,
                success: function (data, textStatus) {
                    //增加新版报错分支
                    if (data && typeof (data) == "string" && data.indexOf("{\"errcode\"") == 0) {
                        msgUI("获取用户失败：" + url);
                        return;
                    }
                    flowRouting.userIDs = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    msgUI("获取用户失败：" + url);
                }
            });
        }
    }

    var urlConstant = {
        org: "/MvcConfig/Auth/Org/GetTree?SelectMode=Single&RootFullID=",
        user: "/MvcConfig/Auth/User/GetOrgUserList?RootFullID=",
        scopeUser: "/MvcConfig/Auth/User/GetScopeUserList?GroupID=",
        selectDoback: "/MvcConfig/Auth/User/GetDobackUserList",
        selectMultiPrjUser: "/MvcConfig/Auth/User/GetProjectScopeUserList",
        selectOnePrjUser: "/MvcConfig/Auth/User/GetProjectScopeUserList"
    };
    switch (this.flowRouting.selectMode) {
        case "SelectOneUser":
            url = urlConstant.user;
            popHtml(url, { parameter: 'Code:工号,Name:姓名', onDestroy: flowExecUserSelected, title: '单选人', width: 200 });
            break;
        case "SelectMultiUser":
            url = urlConstant.user;
            popHtml(url, { parameter: 'Code:工号,Name:姓名', onDestroy: flowExecUserSelected, title: '多选人', width: 200 });
            break;
        case "SelectOneUserInScope":
            url = urlConstant.scopeUser + "&OrgIDs=" + flowRouting.orgIDs + "&RoleIDs=" + flowRouting.roleIDs;
            popHtml(url, { parameter: 'Code:工号,Name:姓名', onDestroy: flowExecUserSelected, title: '范围单选人', width: 200 });
            break;
        case "SelectMultiUserInScope":
            url = urlConstant.scopeUser + "&OrgIDs=" + flowRouting.orgIDs + "&RoleIDs=" + flowRouting.roleIDs;
            popHtml(url, { parameter: 'Code:工号,Name:姓名', onDestroy: flowExecUserSelected, title: '范围多选人', width: 200 });
            break;
        case "SelectOneOrg":
            url = urlConstant.org;
            popHtml(url, { parameter: 'Name:名称', onDestroy: flowExecUserSelected, title: '单选部门', width: 200 });
            break;
        case "SelectMultiOrg":
            url = urlConstant.org;
            popHtml(url, { parameter: 'Name:名称', onDestroy: flowExecUserSelected, title: '多选部门', width: 200 });
            break;
        case "SelectDoback":
            url = urlConstant.selectDoback + "?UserIDs=" + this.flowRouting.userIDs;
            popHtml(url, { parameter: 'Code:工号,Name:姓名', onDestroy: flowExecUserSelected, title: '范围重新选人', width: 200 });
            break;
        case "SelectMultiPrjUser":
            url = urlConstant.selectMultiPrjUser + "?OrgIDs=" + flowRouting.orgIDs + "&RoleIDs=" + flowRouting.roleIDs;
            popHtml(url, { parameter: 'Code:工号,Name:姓名', onDestroy: flowExecUserSelected, title: '项目范围多选人', width: 200 });
            break;
        case "SelectOnePrjUser":
            url = urlConstant.selectOnePrjUser + +"?OrgIDs=" + flowRouting.orgIDs + "&RoleIDs=" + flowRouting.roleIDs;
            popHtml(url, { oparameter: 'Code:工号,Name:姓名', nDestroy: flowExecUserSelected, title: '项目范围单选人', width: 200 });
            break;
    }
    $("#flowMsg").html(retVal);
    $("#flowMsg").css("display", "block");
    $("#flowMsg").css("left", left + 30);
    $("#flowMsg").css("top", top + 20);
}


function detailRouting() {
    var settings = jQuery.extend(true, {}, normalParamSettings, {});
    var grid = mini.get("#" + settings.gridId);
    var selectRows = grid.getSelecteds();
    addExecuteParam("data", JSON.stringify(selectRows));
    execute('DetailRouting', {
        onComplete: function (data, settings) {
            msgUI(data);
        }
    });
}
function flowBatchApproval() {
    var settings = jQuery.extend(true, {}, normalParamSettings, {});
    var grid = mini.get("#" + settings.gridId);
    if (grid != undefined) {
        var selectRows = grid.getSelecteds();
        if (selectRows.length > 0) {
            var selectJson = JSON.stringify(selectRows);
            mini.confirm("您选择了<font color='red'>" + selectRows.length + "</font>条记录,确认要审批吗？&nbsp&nbsp&nbsp<a href='#' onclick='detailRouting()'>详细</a>", "提交确认", function (e) {
                if (e == "ok") {
                    addExecuteParam("data", selectJson);
                    execute('BatchApproval', {
                        onComplete: function (data, settings) {
                            msgUI("成功审批<font color='red'>" + data + "</font>条记录,失败<font color='red'>" + (selectRows.length - data) + "</font>条!", 7, function (e) {
                                window.location.reload();
                            });
                        }
                    });
                }
            });
        }

    }
}

//流程执行人选择
function flowExecUserSelecting() {
    var url = "";

    //流程结束需要选人（启动新流程）
    //    //流程结束不需要选人
    //    if (this.flowRouting.flowComplete == true) {
    //        flowSubmit("", "", "", "");
    //        return;
    //    }

    //多个分支的时候直接提交，在后台取人
    if (this.flowRouting.routingID.split(',').length > 1) {
        flowSubmit("", "", "", "");
        return;
    }

    //下一步执行数据取自表单
    if (flowRouting.orgIDFromField != "") {
        if (flowRouting.orgIDFromField.indexOf('{') >= 0) {
            flowRouting.orgIDs = flowRouting.orgIDFromField.replace(/\{[0-9a-zA-Z_\u4e00-\u9faf]*\}/g, function (str) {
                var v = str.substr(1, str.length - 2);
                return mini.getbyName(v).getValue();
            });
        }
        else {
            var orgs = "";
            for (var i = 0; i < flowRouting.orgIDFromField.split(',').length; i++) {
                var item = flowRouting.orgIDFromField.split(',')[i];
                var v = mini.getbyName(item).getValue();
                if (v && flowRouting.orgIDs.indexOf(v) == -1) {
                    orgs += ',' + v;
                }
            }
            flowRouting.orgIDs = orgs != '' ? orgs : flowRouting.orgIDs;
            if (flowRouting.orgIDs && flowRouting.orgIDs.indexOf(',') == 0)
                flowRouting.orgIDs = flowRouting.orgIDs.substr(1);
        }
    }
    if (flowRouting.roleIDsFromField != "") {
        flowRouting.roleIDs = mini.getbyName(flowRouting.roleIDsFromField).getValue();
    }
    if (flowRouting.userIDsFromField != "") {
        var userIDs = [];//flowRouting.userIDs.split(',');
        var fieldIds = flowRouting.userIDsFromField.split(',');
        for (var i = 0; i < fieldIds.length; i++) {
            var ids = mini.getbyName(fieldIds[i]).getValue().split(',');
            for (var j = 0; j < ids.length; j++) {
                if (userIDs.indexOf(ids[j]) < 0) {
                    userIDs.push(ids[j]);
                }
            }
        }
        flowRouting.userIDs = userIDs.join(',');
        if (flowRouting.userIDs.indexOf(',') == 0)
            flowRouting.userIDs = flowRouting.userIDs.substr(1);

    }
    if (flowRouting.userIDsGroupFromField != "") {
        flowRouting.userIDsGroup = mini.getbyName(flowRouting.userIDsGroupFromField).getValue();
    }
    //角色或部门取自表单时,此ajax方法同步执行
    if (flowRouting.orgIDFromField != "" || flowRouting.roleIDsFromField != "") {
        if (this.flowRouting.selectMode != "SelectOneOrg" && this.flowRouting.selectMode != "SelectMultiOrg") {
            var url = "GetUserIDs?roleIDs=" + flowRouting.roleIDs + "&orgIDs=" + flowRouting.orgIDs + "&excludeUserIDs=" + flowRouting.excudeUserIDs;
            url = changeToFullUrl(url);
            jQuery.ajax({
                url: url,
                type: "post",
                data: {},
                cache: false,
                async: false,
                success: function (data, textStatus) {
                    //增加新版报错分支
                    if (data && typeof (data) == "string" && data.indexOf("{\"errcode\"") == 0) {
                        msgUI("获取用户失败：" + url);
                        return;
                    }
                    flowRouting.userIDs = data;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    msgUI("获取用户失败：" + url);
                }
            });
        }
    }

    //已经有执行人    
    if (this.flowRouting.userIDs != "" && (this.flowRouting.selectAgain == false && this.flowRouting.selectMode != 'SelectDoback')) {
        //无需再单选人或多选人
        if (this.flowRouting.selectMode == "SelectOneUser" || this.flowRouting.selectMode == "SelectMultiUser") {
            flowSubmit(flowRouting.userIDs, flowRouting.userIDsGroup, flowRouting.roleIDs, flowRouting.orgIDs);
            return;
        }
        //如果执行人为一个，则无需再范围单选人
        if (this.flowRouting.selectMode == "SelectOneUserInScope" || this.flowRouting.selectMode == "SelectMultiUserInScope") {
            if (flowRouting.userIDs.split(',').length == 1) {
                flowSubmit(flowRouting.userIDs, flowRouting.userIDsGroup, flowRouting.roleIDs, flowRouting.orgIDs);
                return;
            }
        }
    }

    switch (this.flowRouting.selectMode) {
        case "SelectOneUser":
            url = urlConstant.singleUser;
            openWindow(url, { onDestroy: flowExecUserSelected, title: '单选人', width: 520, height: 480 });
            break;
        case "SelectMultiUser":
            url = urlConstant.multiUser;
            openWindow(url, { onDestroy: flowExecUserSelected, title: '多选人', width: 750, height: 595 });
            break;
        case "SelectOneUserInScope":
            url = urlConstant.singleScopeUser + "&OrgIDs=" + flowRouting.orgIDs + "&RoleIDs=" + flowRouting.roleIDs + "&UserIDs=" + this.flowRouting.userIDs;
            openWindow(url, { onDestroy: flowExecUserSelected, title: '范围单选人', width: 750, height: 600 });
            break;
        case "SelectMultiUserInScope":
            url = urlConstant.multiScopeUser + "&OrgIDs=" + flowRouting.orgIDs + "&RoleIDs=" + flowRouting.roleIDs + "&UserIDs=" + this.flowRouting.userIDs;
            openWindow(url, { onDestroy: flowExecUserSelected, title: '范围多选人', width: 750, height: 600 });
            break;
        case "SelectOneOrg":
            url = urlConstant.singleOrg;
            openWindow(url, { onDestroy: flowExecUserSelected, title: '单选部门', width: 320, height: 580 });
            break;
        case "SelectMultiOrg":
            url = urlConstant.multiOrg;
            openWindow(url, { onDestroy: flowExecUserSelected, title: '多选部门', width: 320, height: 580 });
            break;
        case "SelectDoback":
            url = "/MvcConfig/Auth/User/DobackSelector?UserIDs=" + this.flowRouting.userIDs;
            openWindow(url, { onDestroy: flowExecUserSelected, title: '范围重新选人', width: 550, height: 600 });
            break;
        case "SelectMultiPrjUser":
            url = "/MvcConfig/Auth/User/ProjectMultiScopeSelector" + "?OrgIDs=" + flowRouting.orgIDs + "&RoleIDs=" + flowRouting.roleIDs;
            openWindow(url, { onDestroy: flowExecUserSelected, title: '项目范围多选人', width: 550, height: 600 });
            break;
        case "SelectOnePrjUser":
            url = "/MvcConfig/Auth/User/ProjectSingleScopeSelector" + "?OrgIDs=" + flowRouting.orgIDs + "&RoleIDs=" + flowRouting.roleIDs;
            openWindow(url, { onDestroy: flowExecUserSelected, title: '项目范围单选人', width: 550, height: 600 });
            break;
        default:
            flowSubmit(flowRouting.userIDs, flowRouting.userIDsGroup, flowRouting.roleIDs, flowRouting.orgIDs);
            break;
    }
}

function flowExecUserSelected(data, setting) {
    if (data == undefined || data == "close" || data.length == 0)
        return;
    data = mini.decode(data);

    if (flowRouting.selectMode == "SelectOneOrg" || flowRouting.selectMode == "SelectMultiOrg") {
        var roleIDs = flowRouting.roleIDs;
        var orgIDs = getValues(data, "ID");

        var url = "GetUserIDs?roleIDs=" + roleIDs + "&orgIDs=" + orgIDs + "&excludeUserIDs=" + flowRouting.excudeUserIDs;
        url = changeToFullUrl(url);
        jQuery.ajax({
            url: url,
            type: "post",
            data: {},
            cache: false,
            async: "async",
            success: function (data, textStatus) {
                //增加新版报错分支
                if (data && typeof (data) == "string" && data.indexOf("{\"errcode\"") == 0) {
                    msgUI("获取用户失败：" + url);
                    return;
                }
                var userIDs = data;
                flowSubmit(userIDs, "", roleIDs, orgIDs);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                msgUI("获取用户失败：" + url);
            }
        });
    }
    else {
        var userIDs = getValues(data, "ID");
        flowSubmit(userIDs, "", flowRouting.roleIDs, flowRouting.orgIDs);
    }
}

function flowSubmit(nextExecUserIDs, nextExecUserIDsGroup, nextExecRoleIDs, nextExecOrgIDs) {

    var win = window;
    while (win.parent && win != win.parent) {
        win = win.parent
    }

    if (flowRouting.routingID.indexOf(',') > 0) {//分支路由
        win.mini.confirm("确认要" + flowRouting.routingName + "吗？", "提交确认", function (e1) {
            if (e1 == "ok")
                flowSubmitFunc(nextExecUserIDs, nextExecUserIDsGroup, nextExecRoleIDs, nextExecOrgIDs);
        });
    }
    else if (nextExecUserIDs != "") {
        //var url = changeToFullUrl("UserNames?userIDs=" + nextExecUserIDs); //url转化为全路径
        var url = changeToFullUrl("UserNames"); //url转化为全路径

        $.ajax({
            url: url,
            type: "post",
            cache: false,
            data: { userIDs: nextExecUserIDs, excludeUserIDs: flowRouting.excudeUserIDs },
            error: function (jqXHR, textStatus, errorThrown) {
                msgUI("获取用户失败：" + url);
            },
            success: function (text) {
                //增加新版报错分支
                if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                    msgUI("获取用户失败：" + url);
                    return;
                }
                var msg = "<div >";
                var arr = ("接收人：" + text).split(',');
                var index = 1;
                for (var i = 0; i < arr.length; i++) {
                    if (i < arr.length - 1)
                        msg += arr[i] + "，";
                    else
                        msg += arr[i];

                    index++;
                    if (index > 5) {
                        index = 0;
                        msg += "<br/>";
                    }
                }
                if (text.split(',').length > 1)
                    msg += "(共" + text.split(',').length + "人)";

                msg += "</div>";


                win.mini.confirm(msg, "确认要" + flowRouting.routingName + "吗？", function (e1) {
                    if (e1 == "ok")
                        flowSubmitFunc(nextExecUserIDs, nextExecUserIDsGroup, nextExecRoleIDs, nextExecOrgIDs);
                });
            }
        });
    }
    else {
        win.mini.confirm("确认要" + flowRouting.routingName + "吗？", "提交确认", function (e1) {
            if (e1 == "ok")
                flowSubmitFunc(nextExecUserIDs, nextExecUserIDsGroup, nextExecRoleIDs, nextExecOrgIDs);
        });
    }
}

//流程提交到后台执行
function flowSubmitFunc(nextExecUserIDs, nextExecUserIDsGroup, nextExecRoleIDs, nextExecOrgIDs) {
    nextExecUserIDs = $.trim(nextExecUserIDs);
    if (nextExecUserIDs.lastIndexOf(',') == nextExecUserIDs.length - 1)
        nextExecUserIDs = nextExecUserIDs.substr(0, nextExecUserIDs.lastIndexOf(','));
    if (nextExecUserIDs.indexOf(',') == 0)
        nextExecUserIDs = nextExecUserIDs.substr(1);
    addExecuteParam("RoutingID", flowRouting.routingID);
    addExecuteParam("NextExecUserIDs", nextExecUserIDs);
    addExecuteParam("NextExecUserIDsGroup", nextExecUserIDsGroup);
    addExecuteParam("NextExecRoleIDs", nextExecRoleIDs);
    addExecuteParam("NextExecOrgIDs", nextExecOrgIDs);
    addExecuteParam("ExecComment", mini.getbyName("Advice").getValue());
    addExecuteParam("FlowCode", flowCode);

    showLoading();

    var url = "Submit?Urgency=" + mini.getbyName("urgency").getValue();
    url = flowUrlAppendFlowCode(url); //如果存在flowCode则直接追加（流程切换）
    execute(url, {
        actionTitle: flowRouting.routingName, onComplete: function (data, settings) {
            if (getQueryString("RelateField") != "") { //升版框架
                flowSubmitComplete(mini.decode(data));
            }
            else if (getQueryString("closeForm") == "false") {
                flowLoadMenubar(new mini.Form("dataForm").getData());
            }
            else if (flowRouting.closeForm == true) {
                //closeWindow("refresh");
                flowSubmitComplete(mini.decode(data));
            }
            else {
                //弱控不关闭页面时
                hideLoading();
                flowLoadMenubar();
            }

            if (typeof (onFormSubmit) != "undefined") {
                if (!onFormSubmit(flowRouting))
                    return;
            }
        }
    });
}

function flowSubmitComplete(returnData) {
    var ID = returnData.ID;
    var NextTaskExecID = returnData.NextTaskExecID;
    var NextRoutingID = returnData.NextRoutingID;
    var NextRoutingName = returnData.NextRoutingName;
    var NextExecUserIDs = returnData.NextExecUserIDs;

    if (!NextRoutingID) {
        if (getQueryString("RelateField") != "" && getQueryString("closeForm") != "true") {

            showLoading();

            var url = window.location.href.replace("&UpperVersion=" + getQueryString("UpperVersion"), "");
            window.location = url;
        }
        else if (window && window.external && window.external.CloseWindows) {
            window.external.CloseWindows();
        }
        else {
            if (getQueryString("IsClose") != 'false') //是否关闭窗口
                closeWindow("refresh");
            else {
                msgUI("流程执行成功！", 1, function (act) {
                    if (act == "ok") {
                        window.location = window.location.href;
                    }
                });
            }
        }
        return;
    }

    showLoading();
    var url = "Submit?AutoPass=True&ExecComment=&ID=" + ID + "&RoutingID=" + NextRoutingID + "&TaskExecID=" + NextTaskExecID + "&NextExecUserIDs=" + NextExecUserIDs + "&Urgency=" + mini.getbyName("urgency").getValue();
    execute(url, {
        actionTitle: flowRouting.routingName, onComplete: function (data, settings) {
            flowSubmitComplete(mini.decode(data));
        }
    });
}


function flowDoBack(taskExecId, routingId, title) {
    var fun = function (taskExecId, routingId, title) {
        //驳回必须填写意见
        var advice = mini.getbyName("Advice");
        if (advice.visible == true && advice.getValue().trim() == "") {
            msgUI("驳回必须输入意见！");
            return;
        }

        if (typeof (onFormSubmitting) != "undefined") {
            if (!onFormSubmitting())
                return;
        }

        msgUI("确定" + title + "吗？", 2, function (act) {
            if (act == "ok") {
                execSettings = {
                    validateForm: false, onComplete: function (text) {
                        if (typeof (onFormSubmit) != "undefined") {
                            if (onFormSubmit())
                                closeWindow("");
                        }
                        else
                            closeWindow("");
                    }
                };
                var url = "DoBack?TaskExecID=" + taskExecId + "&routingID=" + routingId;
                addExecuteParam("ExecComment", mini.getbyName("Advice").getValue());
                execute(url, execSettings);
            }
        });

    };

    if (allowSignPwdValidation && FlowCurrntStep && FlowCurrntStep.DoBackSignField) {//允许输入签字密码且当前环节有打回的签字字段
        mini.open({
            url: signPwdValidationUrl,
            title: '签字密码验证',
            width: '250',
            height: '120',
            ondestroy: function (action) {
                if (action == "ok") {       //如果点击“确定”
                    var iframe = this.getIFrameEl();
                    //获取选中、编辑的结果
                    var data = iframe.contentWindow.getData();
                    if (data == 'false')
                        msgUI("签字密码错误");
                    else
                        fun(taskExecId, routingId, title);
                }
            }
        });
    }
    else {
        fun(taskExecId, routingId, title);
    }
}

function flowDoBackFirst(taskExecId) {
    var fun = function (taskExecId) {
        //驳回必须填写意见
        var advice = mini.getbyName("Advice");
        if (advice.visible == true && advice.getValue().trim() == "") {
            msgUI("驳回必须输入意见！");
            return;
        }

        if (typeof (onFormSubmitting) != "undefined") {
            if (!onFormSubmitting())
                return;
        }

        msgUI("确定驳回首环节吗？", 2, function (act) {
            if (act == "ok") {
                execSettings = {
                    validateForm: false, onComplete: function (text) {
                        if (typeof (onFormSubmit) != "undefined") {
                            if (onFormSubmit())
                                closeWindow("");
                        }
                        else
                            closeWindow("");
                    }
                };
                var url = "DoBackFirst?TaskExecID=" + taskExecId;
                addExecuteParam("ExecComment", mini.getbyName("Advice").getValue());
                execute(url, execSettings);
            }
        });
    };

    if (allowSignPwdValidation && FlowCurrntStep && FlowCurrntStep.DoBackSignField) {//允许输入签字密码且当前环节有打回的签字字段
        mini.open({
            url: signPwdValidationUrl,
            title: '签字密码验证',
            width: '250',
            height: '120',
            ondestroy: function (action) {
                if (action == "ok") {       //如果点击“确定”
                    var iframe = this.getIFrameEl();
                    //获取选中、编辑的结果
                    var data = iframe.contentWindow.getData();
                    if (data == 'false')
                        msgUI("签字密码错误");
                    else
                        fun(taskExecId);
                }
            }
        });
    }
    else {
        fun(taskExecId);
    }
}

function flowDoBackFirstReturn(taskExecId) {
    if (typeof (onFormSubmitting) != "undefined") {
        if (!onFormSubmitting())
            return;
    }
    flowExecMethod = function () {
        msgUI("确定送驳回人吗？", 2, function (act) {
            if (act == "ok") {
                execSettings = {
                    validateForm: false, onComplete: function (text) {
                        if (typeof (onFormSubmit) != "undefined") {
                            if (onFormSubmit())
                                closeWindow("");
                        }
                        else
                            closeWindow("");
                    }
                };
                var url = "DoBackFirstReturn?TaskExecID=" + taskExecId;
                addExecuteParam("ExecComment", mini.getbyName("Advice").getValue());
                execute(url, execSettings);
            }
        });
    };
    //showWindow('adviceWindow');
    flowExecMethod();
}

function flowChart(id) {
    var settings = $.extend({ title: '流程说明', width: 1000 }, "");
    openWindow('/MvcConfig/Workflow/Trace/FlowChart?ID=' + id + "&tmplCode=" + getQueryString("TmplCode"), settings);
}

function flowTrace(winSettings) {
    var settings = $.extend({ title: '流程跟踪', width: 1000 }, winSettings);
    openWindow('/MvcConfig/Workflow/Trace/Diagram?ID={ID}&FuncType=FlowTrace', settings);
}

function flowExport(tmplCode, id) {
    ExportWord(tmplCode, id);
}

function flowPdf(tmplCode, id) {
    ExportPdf(tmplCode, id);
}

function flowSave(execSettings) {
    if (typeof (onFormSaving) != "undefined") {
        if (!onFormSaving())
            return;
    }
    ////验证输入
    //if (!validateInput()) {
    //    if (errorTexts.length > 0 && showErrors) {
    //        var s = "";
    //        for (var i = 0; i < errorTexts.length; i++) {
    //            s += "<div style='text-align:left'>" + errorTexts[i] + "</div>";
    //        }
    //        msgUI(s);
    //    }
    //    else {
    //        msgUI("当前输入的信息有误，请重新检查！", 1);
    //    }
    //    return;
    //}

    execSettings = $.extend({ closeWindow: false, refresh: false, validateForm: false }, execSettings);
    //增加执行意见
    addExecuteParam("FlowAdvice", mini.getbyName("Advice").getValue());

    if (typeof (onFormSaved) != "undefined") {
        execSettings.onComplete = function (data) {
            onFormSaved(data);
        };
    }
    save(execSettings);
}

function flowDelete(execSettings) {
    execSettings = $.extend({
        actionTitle: '删除', validateForm: false, mustConfirm: true, onComplete: function (data) {
            if (getQueryString("RelateField") != "") {
                var url = window.location.href;
                url = url.replace("&ID=" + getQueryString("ID"), "");
                url = url.replace("&VersionNumber=" + getQueryString("VersionNumber"), "");
                url = url.replace("&Versions=" + getQueryString("Versions"), "");
                window.location = url;
            }
            else if (getQueryString("closeForm") != "false") {
                closeWindow("refresh");
            }

        }
    }, execSettings);
    execute('Delete', execSettings);
}

function flowAdd(flowCode, windowSettings) {
    settings = $.extend({
        url: 'Edit?FlowCode=' + flowCode, onDestroy: function () {
            var grid = mini.get('dataGrid');
            if (grid) grid.reload();
        }
    }, windowSettings);

    if (settings.url.indexOf('FlowCode') < 0) {
        if (settings.url.indexOf('?') < 0) {
            settings.url += "?";
        }
        else {
            settings.url += "&";
        }
        settings.url += "FlowCode=" + flowCode;
    }

    add(settings);
}

function flowEdit(flowCode, windowSettings) {
    settings = $.extend({
        url: 'Edit?ID={ID}&FlowCode=' + flowCode, onDestroy: function () {
            var grid = mini.get('dataGrid');
            if (grid) grid.reload();
        }
    }, windowSettings);

    if (settings.url.indexOf('FlowCode') < 0) {
        if (settings.url.indexOf('?') < 0) {
            settings.url += "?";
        }
        else {
            settings.url += "&";
        }
        settings.url += "FlowCode=" + flowCode;
    }
    edit(settings);
}

function flowWithdraw() {
    execute("DeleteFlow", {
        mustConfirm: true, actionTitle: '撤销', onComplete: function (data, settings) {
            flowLoadMenubar(new mini.Form("dataForm").getData());
            window.location.reload();
        }
    });
}
//流程编辑页面的自由撤销
function flowFreeWithdraw() {
    execute("FreeWidthdraw", {
        mustConfirm: true, actionTitle: '撤销', onComplete: function (data, settings) {
            flowLoadMenubar(new mini.Form("dataForm").getData());
            window.location.reload();
        }
    });
}

function flowWithdrawAsk() {
    execute("WithdrawAskTask", {
        mustConfirm: true, actionTitle: '撤销', onComplete: function (data, settings) {
            flowLoadMenubar(new mini.Form("dataForm").getData());
        }
    });
}

function flowDelegating() {
    var url = urlConstant.singleUser;
    openWindow(url, { onDestroy: flowDelegated });

}
function flowDelegated(data) {
    if (data == undefined || data == "close" || data.length == 0)
        return;
    addExecuteParam("NextExecUserIDs", getValues(data, "ID"));
    execute("DelegateTask", {
        actionTitle: '委托', onComplete: function (data, settings) {
            closeWindow("refresh");
        }
    });
}

function flowCirculating() {
    var url = urlConstant.multiUser;
    openWindow(url, { onDestroy: flowCirculated });
}
function flowCirculated(data) {
    if (data == undefined || data == "close" || data.length == 0)
        return;
    addExecuteParam("NextExecUserIDs", getValues(data, "ID"));
    execute("CirculateTask", {
        actionTitle: '传阅', onComplete: function (data, settings) {
            flowLoadMenubar(new mini.Form("dataForm").getData());
        }
    });
}

function flowAsking() {
    var url = urlConstant.multiUser;
    openWindow(url, { onDestroy: flowAsked });
}

function flowAsked(data) {
    if (data == undefined || data == "close" || data.length == 0)
        return;
    addExecuteParam("NextExecUserIDs", getValues(data, "ID"));
    addExecuteParam("ExecComment", mini.getbyName("Advice").getValue());
    execute("AskTask", {
        actionTitle: '加签', onComplete: function (data, settings) {
            flowLoadMenubar(new mini.Form("dataForm").getData());
        }
    });
}

function flowViewing() {
    flowExecMethod = flowViewed;
    //showWindow('adviceWindow');
    flowExecMethod();
}
function flowViewed() {
    addExecuteParam("ExecComment", mini.getbyName("Advice").getValue());
    execute("ViewTask", {
        onComplete: function (data, settings) {
            closeWindow("refresh");
        }
    });
}

function flowReplying() {
    flowExecMethod = flowReply;
    //showWindow('adviceWindow');
    flowExecMethod();
}

function flowReply() {
    addExecuteParam("ExecComment", mini.getbyName("Advice").getValue());
    execute("ViewTask", {
        actionTitle: '回复', onComplete: function (data, settings) {
            closeWindow("refresh");
        }
    });
}

//-------------------------流程默认意见----------------------------------//
function bindDefaultAdvice(spanDom, mousedownevent) {
    jQuery.ajax({
        url: "/MvcConfig/Auth/User/GetDefaultAdvice",
        data: {},
        dataType: 'json',
        success: function (data, textStatus) {
            if (data.errcode) {
                msgUI("获取默认意见异常！");
                return;
            }
            var adviceDom = jQuery(spanDom);
            if (adviceDom)
            {
                var _html = "";
                for (var p = 0; p < data.length;p++)
                {
                    var _adText = data[p].Advice.trim();
                    var reg1 = new RegExp("\r", "g");
                    _adText = _adText.replace(reg1, "");
                    var reg2 = new RegExp("\n", "g");
                    _adText = _adText.replace(reg2, "");
                    if (_adText == "")
                        continue;
                    _html = $("<span id='_adviceSpan' style='margin-right:10px;border:1px solid #939393;background-color:#eaeaea;padding-left:4px;padding-right:4px;padding-top:2px;display:inline-block;vertical-align:middle;border-radius:4px;position:relative;'><span style='cursor:pointer;margin-top:-4px;overflow: hidden; text-overflow: ellipsis;word-break:keep-all;white-space:nowrap; display:block;max-width:80px' title='" + _adText + "'>" + _adText + "</span><span id='_adviceDel' aid='" + data[p].ID + "' style='display:none;position:absolute;top:-5px;right:-5px;width:12px;height:12px;line-height:9px;color:#fff;border:1px solid red;border-radius:14px;background-color:red;z-index:100;cursor:pointer'>－</span></span>").mousedown(mousedownevent);
                    adviceDom.append(_html);
                }
                //删除功能
                var _rmvBtn = $("<span style='border:1px solid #939393;background-color:#fff;padding-left:4px;padding-right:4px;padding-top:2px;display:inline-block;vertical-align:middle;margin-left:2px'><span style='cursor:pointer;margin-top:-4px;overflow: hidden; display:block;'> － </span></span>");
                _rmvBtn.mousedown(function () {
                    var _rmvflag = $(this).children()[0].innerText;
                    if (_rmvflag == "－") {
                        $(this).children()[0].innerText = "删除完成";
                        _adviceBtn.css("display", "none");
                        adviceDom.find("#_adviceSpan").unbind("mousedown");
                        adviceDom.find("#_adviceDel").css("display", "block").mousedown(function () {
                            var __delBadge = $(this);

                            $.ajax({
                                url: "/MvcConfig/Auth/User/DelDefaultAdvice",
                                type: "post",
                                data: { id: __delBadge.attr("aid") },
                                dataType: 'json',
                                cache: false,
                                success: function (data, textStatus) {
                                    if (data.errcode) {
                                        msgUI(data.errmsg);
                                        return;
                                    }
                                    __delBadge.parent().remove();
                                },
                                error: function () {
                                    msgUI("服务器异常！");
                                }
                            });
                        });
                    }
                    else {
                        $(this).children()[0].innerText = " － ";
                        _adviceBtn.css("display", "inline-block");
                        adviceDom.find("#_adviceSpan").mousedown(mousedownevent);
                        adviceDom.find("#_adviceDel").css("display", "none");
                    }
                });
                adviceDom.append(_rmvBtn);
                adviceDom.append("&nbsp;");
                //新增功能
                var _adviceBtn = $("<span style='border:1px solid #939393;background-color:#fff;padding-left:4px;padding-right:4px;padding-top:2px;display:inline-block;vertical-align:middle;'><span style='cursor:pointer;margin-top:-4px;overflow: hidden; display:block;'> ＋ </span></span>");
                _adviceBtn.mousedown(function () {
                    var _newAdvice = prompt('请输入新意见模板！');
                    if (_newAdvice !== null && _newAdvice.trim() != "") {
                        $.ajax({
                            url: "/MvcConfig/Auth/User/AddDefaultAdvice",
                            type: "post",
                            data: { advice: _newAdvice },
                            dataType: 'json',
                            cache: false,
                            success: function (data, textStatus) {
                                if (data.errcode) {
                                    msgUI("服务器异常！");
                                    return;
                                }
                                var _nhtml = $("<span id='_adviceSpan' style='margin-right:10px;border:1px solid #939393;background-color:#eaeaea;padding-left:4px;padding-right:4px;padding-top:2px;display:inline-block;vertical-align:middle;border-radius:4px;position:relative;'><span style='cursor:pointer;margin-top:-4px;overflow: hidden; text-overflow: ellipsis;word-break:keep-all;white-space:nowrap; display:block;max-width:80px' title='" + _newAdvice + "'>" + _newAdvice + "</span><span id='_adviceDel' aid='" + data.ID + "' style='display:none;position:absolute;top:-5px;right:-5px;width:12px;height:12x;line-height:9px;color:#fff;border:1px solid red;border-radius:14px;background-color:red;z-index:100;cursor:pointer'>－</span></span>").mousedown(mousedownevent);
                                _rmvBtn.before(_nhtml);
                            },
                            error: function () {
                                msgUI("服务器异常！");
                            }
                        });
                    }
                });
                adviceDom.append(_adviceBtn);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var msg = getErrorFromHtml(jqXHR.responseText);
            if (msg) {
                msgUI(msg, 4);
            }
        }
    });

}

//--------------------------流程操作信息----------------------------------//

function bindFlowComment() {
    jQuery.ajax({
        url: urlConstant.flowComment + "GetFlowReplyComment?id=" + getQueryString("ID"),
        data: {},
        success: function (data, textStatus) {
            //增加新版报错分支
            if (data && typeof (data) == "string" && data.indexOf("{\"errcode\"") == 0) {
                msgUI("获取用户失败：" + url);
                return;
            }
            $("#comment").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var msg = getErrorFromHtml(jqXHR.responseText);
            if (msg) {
                msgUI(msg, 4, function (act) {

                });
            }
        }
    });
}

function replyComment(id, name) {
    var windowId = "commentWindow";
    document.getElementById('nodeID').value = id;
    showWindow(windowId);
}

function addCommentUser() {
    url = urlConstant.multiUser;
    var cUser = $("#commentUser");
    var ids = $(cUser).attr('ids');
    if (ids != undefined && ids.length > 0) {
        var fullUrl = url.substr(0, url.lastIndexOf('/') + 1) + "GetUsers?ids=" + ids;
        jQuery.ajax({
            url: fullUrl,
            type: "post",
            data: {},
            cache: false,
            async: "async",
            success: function (data, textStatus) {
                //增加新版报错分支
                if (data && typeof (data) == "string" && data.indexOf("{\"errcode\"") == 0) {
                    msgUI("获取用户失败：" + url);
                    return;
                }
                commentOpenWindow(url, data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                msgUI("获取用户失败：" + url);
            }
        });
    } else { commentOpenWindow(url); }
}

function commentOpenWindow(url, data) {
    var cUser = $("#commentUser");
    var clear = $("#clearComment");
    var cuc = $("#clearUserComment");
    openWindow(url, {
        title: '多选人', width: 750, height: 595, data: data, onDestroy: function (data) {
            if (data != 'close') {
                var ids = getValues(data, 'ID');
                var names = getValues(data, 'Name');
                if (ids.length > 0) {
                    $(cUser).html(names);
                    $(cUser).attr('title', names);
                    $(cUser).attr('ids', ids);
                    $(clear).hide();
                    $(cuc).show();
                }
            }
        }
    });
}

function clearComment(type) {
    var cUser = $("#commentUser");
    var clear = $("#clearComment");
    var cuc = $("#clearUserComment");
    var clearFile = $("#clearFileComment");
    if (type == 'user') {
        $(cUser).attr('ids', '');
        $(cUser).html('抄送人员');
        $(cuc).hide();
        $(clear).show();
    } else if (type == 'file') {
        $(clearFile).hide();
        $(clear).show();
    } else {
        var form = new mini.Form("#commentForm");
        form.clear();
    }
}

function saveComment() {
    var array = new Array();
    var comment = mini.getbyName('_Comment').getValue();
    if ($.trim(comment) == "") {
        msgUI("回复信息不能为空!");
        return;
    }
    var jsonObj = {};
    function setData(key, value) {
        jsonObj[key] = value;
    }
    setData('flowID', getQueryString("ID"));
    setData('nodeID', document.getElementById('nodeID').value);
    setData('comment', comment);
    setData('ids', $("#commentUser").attr('ids'));
    setData('fileID', mini.getbyName('flowSingleFile').getValue());
    array.push(jsonObj);
    addExecuteParam("data", JSON.stringify(array));
    execute(urlConstant.flowComment + "Save", {
        onComplete: function (data) {
            bindFlowComment();
            var window = mini.get('commentWindow');
            if (!window) { msgUI("未找到指定的window窗体！", 4); return; }
            window.queryWindowId = window.id;
            window.hide();
        }
    });
}

function flowAskClick(TaskUserID, InsTaskID) {
    //用于流程监控
    function myBrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera"
        }; //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Chrome") > -1) {
            return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }; //判断是否IE浏览器
    }

    var browser = myBrowser();
    var e = arguments.callee.caller.arguments[0];
    var left = browser == 'IE' ? e.pageX : e.layerX;
    var top = browser == 'IE' ? e.pageY : e.layerY;
    popHtml(urlConstant.flowAskTask + '?TaskUserID=' + TaskUserID + '&InsTaskID=' + InsTaskID, { parameter: 'ExecComment:送加签意见,ExecUserName:审阅人,AskComment:审阅意见,ExecTime:审阅时间', onDestroy: flowExecUserSelected, title: '加签信息', width: 500 });
    var ask = $('#flowAskMsg');
    ask.html(retVal);
    ask.css("left", left - 510);
    ask.css("top", top - 235);
    if (ask.is(":hidden")) {
        ask.show();
    } else {
        ask.hide();
    }
}

//---------------------操作信息结束----------------------------//

function flowUpperVersion() {
    var id = getQueryString("ID");
    var VersionNumber = getQueryString("VersionNumber");
    var Versions = getQueryString("Versions");

    if (VersionNumber != '' && VersionNumber != undefined) {
        VersionNumber = parseInt(Versions.split(',')[0]) + 1;
    } else {
        VersionNumber = 1;
    }

    var url = window.location.href;
    url = url.replace("&VersionNumber=" + getQueryString("VersionNumber"), "&VersionNumber=" + VersionNumber);
    url = url.replace("&Versions=" + Versions, "&Versions=" + VersionNumber.toString() + "," + Versions);
    url = url.replace("&ID=" + id, "");
    url = url.replace("&AllowUpperVersion=true", "");
    url = url + "&UpperVersion=" + id;

    window.location = url;
}

function onVersionChanged(e) {
    var selectVersion = e.sender.getValue();
    var url = window.location.href;
    url = url.replace("&ID=" + getQueryString("ID"), "");
    url = url.replace("&VersionNumber=" + getQueryString("VersionNumber"), "&VersionNumber=" + selectVersion);
    url = url.replace("&UpperVersion=" + getQueryString("UpperVersion"), "");
    window.location = url;
}

/*************************************
** 导出Excel
**************************************/
function ExportExcel(key, gridId, includeColumns, detailGridId) {
    var grdId = gridId || "dataGrid";
    var grid = mini.get(grdId);
    if (!grid) {
        alert("找不到Grid，请您确认Grid的ID是否设置正确！");
        return;
    }
    var columns = grid.getBottomColumns();
    var excelForm = $("#excelForm" + key);
    if (excelForm.find("input[name='exportCurrentPage']").length > 0 && excelForm.find("input[name='exportCurrentPage']").val() == "false" && grid.totalCount > 10000) {
        if (!confirm("您需要导出的数据超过一万条，您确认要导出吗？")) {
            return;
        }
    }

    function getColumns(columns) {
        columns = columns.clone();
        for (var i = columns.length - 1; i >= 0; i--) {
            var column = columns[i];
            if (!column.field || !column.header || column.header.trim() == '' || column.visible == false) {
                columns.removeAt(i);
            } else {
                if (includeColumns.length == 0 || includeColumns.indexOf(column.field.toLowerCase() + ',') >= 0) {
                    var c = { ChineseName: column.header.trim(), FieldName: column.field, TableName: key };

                    // 判断是否为枚举字段
                    var enumKey = gridEnums[grdId + "." + column.field]
                    if (enumKey) {
                        c.EnumKey = enumKey;
                        c.EnumDataSource = window[enumKey];
                    }

                    // 判断是否为时间字段，设置格式化字符串
                    if (column.dateFormat) {
                        c.DateFormat = column.dateFormat;
                    }

                    //导出excel使用显示字段
                    if (column.displayField) {
                        c.FieldName = column.displayField;
                    }
                    if (column.dataType) {
                        c.DataType = column.dataType;
                    }

                    columns[i] = c;
                }
            }
        }
        return columns;
    }

    // 若有子Grid,追加到导出列表中
    if (typeof detailGridId != "undefined") {
        var detailGrid = mini.get(detailGridId || "detailGrid");
        var detailColumns = detailGrid.getBottomColumns();
        var cloneColumns = columns.clone();
        $.each(detailColumns, function (i, column) {
            cloneColumns.push(column);
        });
        columns = cloneColumns;
    }
    // 获取列信息
    var columns = getColumns(columns);

    var listbox = mini.get("gridColumns" + $.trim(key));
    listbox.loadData(columns);
    listbox.selectAll();

    var win = mini.get('excelWindow' + $.trim(key));
    win.show();

    return;
}

/*************************************
** 导出表单Excel
** tmplKey:Excel表单模板Key
** title:导出Excel的名字
** id:表单数据关联ID
** typeName:完整类型，包含命名空间（必须继承IExportForm）
** pathRoot: 可为空，默认当前站点名字；也可指定，例如："Market"
**************************************/
function exportFormExcel(tmplKey, title, id, typeName, pathRoot) {
    var $iframe = $("iframe[name='ifrm_ExportForm']");
    if ($iframe.length == 0) {
        $iframe = $("<iframe name='ifrm_ExportForm'></iframe>").hide();
        $iframe.appendTo("body");
    }
    var $form = $("#Form_ExportForm");
    if (typeof ($form[0]) == "undefined") {
        if (typeof (pathRoot) == "undefined")
            pathRoot = document.location.pathname.split('/')[1];
        $form = $("<form></form>").attr("id", "Form_ExportForm").attr('action', '/' + pathRoot + '/AsposeExcel/ExportForm').attr('method', 'post').attr("target", "ifrm_ExportForm").hide();
        var $hidTmplKey = $("<input type='hidden' name='tmplKey' />");
        var $hidTitle = $("<input type='hidden' name='title' />");
        var $hidID = $("<input type='hidden' name='id' />");
        var $hidTypeName = $("<input type='hidden' name='typeName' />");
        var $referUrl = $("<input type='hidden' name='referUrl' />");
        $form.append($hidID).append($hidTmplKey).append($hidTitle).append($hidTypeName).append($referUrl);
        $form.appendTo("body");
    }
    $form.find("input[name='tmplKey']").val(tmplKey);
    $form.find("input[name='title']").val(title);
    $form.find("input[name='id']").val(id);
    $form.find("input[name='typeName']").val($.trim(typeName));
    $form.find("input[name='referUrl']").val(window.location.href);
    $form.submit();
}

// 响应自定义列的弹出层的导出事件
function downloadExcelData(key, gridId, title, detailGridId, relateColumn) {
    var grid = mini.get(gridId || "dataGrid");
    var dataurl = changeToFullUrl(grid.getUrl());
    var columns = mini.get("gridColumns" + $.trim(key)).getSelecteds();

    // 提交下载表单（利用iframe模拟Ajax）
    var $excelForm = $("#excelForm" + $.trim(key));

    if ($excelForm.length == 0) {
        alert('请确保ID为excelForm的表单存在！');
    }

    if (!title)
        title = document.title;

    var formData = {
        referUrl: window.location.href,
        dataUrl: dataurl,
        queryFormData: grid._dataSource.loadParams.queryFormData || '',
        quickQueryFormData: grid._dataSource.loadParams.quickQueryFormData || '',
        queryTabData: grid._dataSource.loadParams.queryTabData || '',
        sortField: grid.sortField,
        sortOrder: grid.sortOrder,
        pageSize: grid.pageSize,
        pageIndex: grid.pageIndex,
        excelKey: key,
        title: title,
        jsonColumns: mini.encode(columns)
    };
    //c_hua 2018/09/25 当前页导出，由前端提供数据
    if ($excelForm.find("input[name='exportCurrentPage']").length > 0
        && $excelForm.find("input[name='exportCurrentPage']").val() == "true") {
        var data = grid.getDataView();
        formData["dataUrl"] = mini.encode(data);
    }
    // 若有子Grid,追加子Grid参数
    if (typeof detailGridId != "undefined" && typeof relateColumn != "undefined") {
        var detailGrid = mini.get(detailGridId || "detailGrid");
        formData["dataUrl"] = undefined;
        formData["masterDataUrl"] = dataurl;
        formData["masterColumn"] = grid.idField;
        formData["detailDataUrl"] = changeToFullUrl(detailGrid.getUrl());
        formData["relateColumn"] = relateColumn || "relateId";
    }
    for (var p in formData) {
        $excelForm.find("input[name='" + p + "']").val(formData[p]);
    }
    $excelForm.submit();

    closeExcelWindow(key);
}

function closeExcelWindow(key) {
    var win = mini.get('excelWindow' + $.trim(key));
    win.hide();
}
/*************************************
** Excel导入
**************************************/
function ImportExcel(key, vaildUrl, saveUrl) {
    openWindow("/MvcConfig/Aspose/ImportExcel?excelKey=" + key + "&vaildURL=" + vaildUrl + "&saveURL=" + saveUrl, { title: "数据导入", width: 520, height: 200, showMaxButton: false });
}

function Import() {
    openWindow("/MvcConfig/Aspose/Import?TmplCode=" + getQueryString("TmplCode"), { title: "数据导入", width: 520, height: 200, showMaxButton: false });
}

/*----------------------------二维码--------------------------------*/
function ExportQRCode(windowSettings) {
    function Export() {
        addExecuteParam("TmplCode", getQueryString("TmplCode"));
        addExecuteParam("ListData", grid.getSelecteds().length > 0 ? mini.encode(grid.getSelecteds()) : mini.encode(grid.getData()));
        execute(urlConstant.CreateQRCodes, {
            refresh: false, onComplete: function (data, settings) {
                window.open(urlConstant.ExportQRCode + "?TmplCode=" + getQueryString("TmplCode"));
            }
        });
    }
    var settings = jQuery.extend(true, {}, windowParamSettings, windowSettings);
    var grid = mini.get(settings.gridId);
    if (grid.getSelecteds().length == 0) {
        msgUI("本次导出没选择记录将导出全部,确认导出么?", 2, function (act) {
            if (act == "ok") {
                Export();
            }
        });
    } else {
        Export();
    }
}

function QRCodeSave(imgName) {
    var url = urlConstant.QRCodeDownLoad + "?ImgName=" + imgName;
    window.open(url);
}

function showQRCode(id, field, value) {
    var imgID = id + '_' + field + ".jpg";
    addExecuteParam("ID", id);
    addExecuteParam("FieldCode", field);
    addExecuteParam("Text", value);
    execute(urlConstant.QRCodeCreate, {
        onComplete: function (data) {
            document.getElementById("QRCodeImg").innerHTML = '<img style="width:135px;height:135px;" src="/MvcConfig/Scripts/Images/QRCode/' + imgID + '"/>';
        }
    });
    var onclick = 'onclick="QRCodeSave(\'' + imgID + '\')"';
    var $btn = "<a class='mini-button mini-button-plain' style='margin-right: 20px;' " + onclick + "  href='javascript:void(0)'><span class='mini-button-text  mini-button-icon icon-down'>"
        + "另存为</span></a> <a class='mini-button mini-button-plain' hidefocus='' onclick='hideWindow(\"QRCodeWindow\")' href='javascript:void(0)'><span class='mini-button-text  mini-button-icon icon-undo'>取消</span></a>";
    document.getElementById("btnQRCode").innerHTML = $btn;
    var window = mini.get('QRCodeWindow');
    if (!window) { msgUI("未找到指定的window窗体！", 4); return; }
    window.onscroll = scroll;
    window.queryWindowId = window.id;
    window.show();
}

function rendererQRCode(e) {
    if (e.row && e.row.ID && e.value != '') {
        var img = '<img style="width:16px;height:16px;float:right;cursor:pointer;position: absolute;right:0px;top:4px;" title="二维码" src="/MvcConfig/Scripts/Images/QRCode.png" onclick="showQRCode(\'' + e.row.ID + '\',\'' + e.field + '\',\'' + e.value + '\')" />';
        return e.value + img;
    } else {
        return e.value;
    }
}

/*----------------------------二维码结束--------------------------------*/



/*---------------------------------------------------------流程方法结束--------------------------------------------------------*/


//Word导出
function ExportWord(tmplCode, id) {
    var url = "/MvcConfig/UI/Word/Export?TmplCode=" + tmplCode + "&ID=" + id;
    window.location.href = url;
    // window.open(url);该代码会重新打开一个页面，企业微信pc端，打开后有1个空白页面，不会自动关闭
}
//Pdf导出
function ExportPdf(tmplCode, id, filename) {
    var url = "/MvcConfig/UI/Word/Export?pdf=true&TmplCode=" + tmplCode + "&ID=" + id;
    if (filename) {
        url += "&filename=" + filename;
    }
    window.location.href = url;
    // window.open(url);该代码会重新打开一个页面，企业微信pc端，打开后有1个空白页面，不会自动关闭
}

/*---------------------------------------------------GridChart开始------------------------------------------------------------*/

function showGirdChartSettings() {
    showWindow('chartSettings');
}

function hideGridChartSettings() {
    hideWindow('chartSettings');
}

function createChart(title, name, data) {

    var groupbyField = mini.get("groupbyField").getValue();
    var sumField = mini.get("sumField").getValue();
    var chartType = "PieChart";
    if ($("#ckb2").attr("checked") == "checked")
        chartType = "ColumnChart";
    else if ($("#ckb3").attr("checked") == "checked")
        chartType = "LineChart";

    if (groupbyField == "") {
        msgUI("请选择统计项！");
        return;
    }
    if (sumField == "") {
        msgUI("请选择统计项数值！");
        return;
    }

    if (chartType == "") {
        msgUI("请选择图表类型！");
        return;
    }

    hideWindow('chartSettings');
    switch (chartType) {
        case 'PieChart':
            createPie(groupbyField, sumField, data, title, name);
            break;
        case 'LineChart':
            createLineChart(groupbyField, sumField, data, title, name);
            break;
        case 'ColumnChart':
            createColumnChart(groupbyField, sumField, data, title, name);
            break;
    }

    showWindow('chartWindow');
}

function createPie(groupbyField, sumField, data, title, name) {

    var data = createPieData(groupbyField, sumField, data);

    $('#container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        xAxis: {
            categories: ['分类1', '分类2', '分类3', '分类4']
        },
        series: [{
            type: 'pie',
            name: name,
            data: data
        }]
    });
}

function createPieData(groupbyField, sumField, data) {

    var groupbyArr = [];
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var flag = false;
        for (var j = 0; j < groupbyArr.length; j++) {
            if (groupbyArr[j].name == row[groupbyField]) {
                flag = true;
                break;
            }
        }
        if (flag == false) {
            groupbyArr.push({ name: row[groupbyField], y: 0 });
        }
    }

    for (var i = 0; i < groupbyArr.length; i++) {
        var groupby = groupbyArr[i].name;
        for (var j = 0; j < data.length; j++) {
            var row = data[j];
            if (row[groupbyField] == groupby)
                groupbyArr[i].y += row[sumField];
        }
    }

    return groupbyArr;
}

function createLineChart(groupbyField, sumField, data, title, name) {

    var categories = createLineCategories(groupbyField, data);
    var data = createLineData(groupbyField, sumField, data);

    $('#container').highcharts({
        title: {
            text: title,
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ''
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: name,
            data: data
        }]
    });

}

function createColumnChart(groupbyField, sumField, data, title, name) {

    var categories = createLineCategories(groupbyField, data);
    var data = createLineData(groupbyField, sumField, data);

    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: title
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Rainfall (mm)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: name,
            data: data
        }]
    });

}

function createLineCategories(groupbyField, data) {

    var groupbyArr = [];
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var flag = false;
        for (var j = 0; j < groupbyArr.length; j++) {
            if (groupbyArr[j] == row[groupbyField]) {
                flag = true;
                break;
            }
        }
        if (flag == false) {
            groupbyArr.push(row[groupbyField]);
        }
    }

    return groupbyArr;
}

function createLineData(groupbyField, sumField, data) {
    var groupbyArr = createLineCategories(groupbyField, data);

    var result = [];
    for (var i = 0; i < groupbyArr.length; i++) {
        var v = 0.0;
        for (var j = 0; j < data.length; j++) {
            var row = data[j];
            if (row[groupbyField] == groupbyArr[i])
                v += row[sumField];
        }

        result.push(v);
    }
    return result;
}

var chartType = [
    { value: 'PieChart', text: '饼状图' },
    { value: 'LineChart', text: '折线图' },
    { value: 'ColumnChart', text: '柱状图' }
];

/*---------------------------------------------------GridChart结束------------------------------------------------------------*/
$(function () {//禁止退格键后退

    //处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
    function banBackSpace(e) {
        var ev = e || window.event; //获取event对象
        var obj = ev.target || ev.srcElement; //获取事件源

        var t = obj.type || obj.getAttribute('type'); //获取事件源类型

        //获取作为判断条件的事件类型
        var vReadOnly = obj.getAttribute('readonly');
        var vEnabled = obj.getAttribute('enabled');
        //处理null值情况
        vReadOnly = (vReadOnly == null) ? false : vReadOnly;
        vEnabled = (vEnabled == null) ? true : vEnabled;

        //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
        //并且readonly属性为true或enabled属性为false的，则退格键失效
        var flag1 = (ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea")
            && (vReadOnly == true || vEnabled != true)) ? true : false;

        //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
        var flag2 = (ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea")
            ? true : false;

        //判断
        if (flag2) {
            return false;
        }
        if (flag1) {
            return false;
        }
    }

    //禁止后退键 作用于Firefox、Opera
    document.onkeypress = banBackSpace;
    //禁止后退键 作用于IE、Chrome
    document.onkeydown = banBackSpace;

});


//表单打印*****************************************************************//
function printWord(tmplCode, id) {
    var wdapp;
    var wddoc;

    try {
        var WshNetwork = new ActiveXObject("WScript.Network");
        var oPrinters = WshNetwork.EnumPrinterConnections();
        if (oPrinters.length < 1) {
            msgUI("您的机器没有安装打印机!")
            return;
        }
        wdapp = new ActiveXObject("Word.Application");

    } catch (e) {
        msgUI("如需打印，请设置IE对应选项“Internet选项-安全-自定义级别-ActiveX”下的所有选项启用");
    }

    var url = "http://" + window.location.host + "/MvcConfig/UI/Word/Export?TmplCode=" + tmplCode + "&ID=" + id;

    //alert(url);
    wdapp.Documents.Open(url);
    //alert("地址已打开");
    wddoc = wdapp.ActiveDocument;
    wdapp.visible = false; //word模板是否可见  
    //wddoc.saveAs("c:\\PrinterTemp.doc"); //保存临时文件word  

    //alert("开始打印");
    wdapp.Application.Printout(); //调用自动打印功能  

    wdapp.quit();
    wdapp = null;
    wddoc.quit();
    wddoc = null;
    //alert("完成");
    msgUI("打印任务已送达打印机！");

}

//ExcelPrint
function printExcel(tmplCode, id, preView) {
    var xls;

    try {
        var WshNetwork = new ActiveXObject("WScript.Network");
        var oPrinters = WshNetwork.EnumPrinterConnections();
        if (oPrinters.length < 1) {
            msgUI("您的机器没有安装打印机!")
            return;
        }
        xls = new ActiveXObject("Excel.Application");

    } catch (e) {
        msgUI("如需打印，请设置IE对应选项“Internet选项-安全-自定义级别-ActiveX”下的 对未标记为可安全执行脚本的ActiveX控件执行脚本。");
        return;
    }

    var excelUrl = "http://" + window.location.host + ":" + window.location.port + "/MvcConfig/UI/ExcelPrint/ExcelTmpl?TmplCode=" + tmplCode;


    try {
        var xlBook = xls.Workbooks.Open(excelUrl);
        var xlSheet = xlBook.Worksheets(1);
    } catch (e) {
        msgUI("打开Excel失败，请确保安装了Excel！");
        return;
    }


    jQuery.ajax({
        url: "/MvcConfig/UI/ExcelPrint/GetExcelPrintData?tmplCode=" + tmplCode + "&ID=" + id,
        type: "post",
        success: function (text, textStatus) {
            //增加新版报错分支
            if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                msgUI("Excel打印配置信息错误！");
                return;
            }
            var data = mini.decode(text);
            data = data[0];
            var settings = mini.decode(data["ItemSettings"]);

            var baseRowIndex = 0;
            for (var i = 0; i < settings.length; i++) {
                var item = settings[i];
                var row = item["Row"] ? Number(item["Row"]) : 0;
                var colA = item["Col"] ? item["Col"] : "A";
                var col = colA.charCodeAt() - 64;
                var field = item["Code"];

                row += baseRowIndex;

                if (item["ItemType"] == "Text" || item["ItemType"] == "Enum") {
                    if (row && col && data[field])
                        xlSheet.Cells(row, col).Value = data[field];
                }
                else if (item["ItemType"] == "Date") {
                    if (row && col && data[field])
                        xlSheet.Cells(row, col).Value = new Date(data[field]).format("yyyy-MM-dd");
                }
                else if (item["ItemType"] == "Sign") {
                    var url = window.location.protocol + "//" + window.location.host + "/MvcConfig/Image/GetSignPic?UserId=" + data[field];
                    var shape = xlSheet.Shapes.AddShape(1, xlSheet.Cells(row, col).Left, xlSheet.Cells(row, col).Top, 60, 25);
                    shape.Fill.UserPicture(url);
                    shape.Line.Visible = 0;
                }
                else if (item["ItemType"] == "SubTable") {

                    var subTableValue = mini.decode(data[field]);

                    var dic = mini.decode(item["Settings"]);
                    var listDic = mini.decode(dic["listData"]);
                    for (var j = 0; j < subTableValue.length; j++) {
                        //插入新行
                        xlSheet.Range("A" + (row) + ":R" + (row)).insert();
                        baseRowIndex++;
                    }
                    for (var j = 0; j < listDic.length; j++) {

                        var subItem = listDic[j];
                        var _colA = subItem["Col"];
                        var _col = _colA.charCodeAt() - 64;

                        field = subItem["Code"];

                        for (var k = 0; k < subTableValue.length; k++) {
                            var subTableRow = subTableValue[k];
                            xlSheet.Cells(row + k, _col).Value = subTableRow[field];
                        }
                    }
                }
            }

            if (preView) {
                xls.Visible = true;
                xlSheet.PrintPreview();
                xlBook.Close(false);
            }
            else {
                xlBook.PrintOut();
                xlBook.Close(false);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            msgUI("Excel打印配置信息错误！");
        }
    });
}

function printForm() {
    var url = replaceUrl('/MvcConfig/UI/Form/FormPrint?TmplCode={TmplCode}&ID={ID}');
    //var url = "MvcConfig/UI/Form/FormPrint?TmplCode=" + tmplCode + "&ID=" + id;
    window.open(url);
}

function showItemHelper(data) {
    var settings = { title: "帮助", data: data };
    openWindow("/MvcConfig/UI/Form/HelpView", settings);
}


//列表列头菜单
var ColumnsContextMenu = function (grid, customCols) {
    var me = this;
    this.grid = grid;
    this.origCustomCols = customCols;
    this.menu = this.createMenu();

    //this.menu.on("beforeopen", this.onBeforeOpen, this);
    grid.setHeaderContextMenu(this.menu);

}
ColumnsContextMenu.prototype = {
    createMenu: function () {
        var grid = this.grid;

        //创建菜单对象
        var menu = mini.create({ type: "menu", hideOnClick: false });

        //创建自定义菜单列
        var items = [
            { text: "设置", name: "savePrivate", iconCls: "icon-project" },
            { text: "恢复", name: "delPrivate", iconCls: "icon-undo" },
            { type: "separator" }];

        //创建隐藏菜单列
        var columns = grid.getBottomColumns();
        for (var i = 0, l = columns.length; i < l; i++) {
            var column = columns[i];
            if (column.hideable) continue;

            if (!column.visible)
            {
                var _isNeed = true;
                if (this.origCustomCols)
                {
                    //区别默认隐藏还是自定义隐藏
                    for (var k = 0; k < this.origCustomCols.length; k++) {
                        if (column.field == this.origCustomCols[k].field && !this.origCustomCols[k].visible) {
                            _isNeed = false;
                            break;
                        }
                    }
                }
                else
                    _isNeed = false;

                if (!_isNeed)
                    continue;
            }

            var item = {};
            item.checked = column.visible;
            item.checkOnClick = true;
            item.text = column.header;
            if (item.text == "&nbsp;") {
                if (column.type == "indexcolumn") item.text = "序号";
                if (column.type == "checkcolumn") item.text = "选择";
            }
            item.enabled = column.enabled;
            item._column = column;
            items.push(item);
        }

        menu.setItems(items);
        menu.on("itemclick", this.onMenuItemClick, this);

        return menu;
    },
    onBeforeOpen: function (e) {
        //var grid = this.grid;
        //var column = grid.getColumnByEvent(e.htmlEvent);
        //this.currentColumn = column;
    },
    onMenuItemClick: function (e) {
        var grid = this.grid;
        var menu = e.sender;
        var columns = grid.getBottomColumns();
        var items = menu.getItems();
        var item = e.item;
        var targetColumn = item._column;


        function getBottomColumns(grid) {
            var cols = grid.getBottomColumns();
            var _columns = [];
            for (var i = 0; i < cols.length; i++) {
                var _flag = (cols[i].field) ? cols[i].field : cols[i].header;
                if (_flag)
                    _columns.push({ field: _flag, visible: cols[i].visible, width: cols[i].width, sortIndex: i });
            }
            return _columns;
        }

        function getTopColumns(grid) {
            var cols = grid.getColumns();
            var _columns = [];
            for (var i = 0; i < cols.length; i++) {
                var _flag = (cols[i].field) ? cols[i].field : cols[i].header;
                if (_flag)
                    _columns.push({ field: _flag, visible: cols[i].visible, width: cols[i].width, sortIndex: i });
            }
            return _columns;
        }

        //显示/隐藏列
        if (targetColumn) {

            //确保起码有一列是显示的
            var checkedCount = 0;
            for (var i = 2, l = items.length; i < l; i++) {
                var it = items[i];
                if (it.getChecked()) checkedCount++;
            }
            if (checkedCount < 1) {
                item.setChecked(true);
                return;
            }

            //显示/隐藏列
            if (item.getChecked()) grid.showColumn(targetColumn);
            else grid.hideColumn(targetColumn);
        }
        else if (item.name == "savePrivate") {
            if (typeof (Storage) === "undefined") {
                msgUI("无法设置，浏览器不支持Storage!");
                return;
            }
            var _tmplCode = getQueryString("tmplcode");
            var key = window.location.pathname + "/" + _tmplCode + "|" + grid.id + "|";
            var _topColumns = getTopColumns(grid);
            localStorage.setItem(key + "top", mini.encode(_topColumns));
            var _botColumns = getBottomColumns(grid);
            localStorage.setItem(key + "bottom", mini.encode(_botColumns));
            menu.hide();
        }
        else if (item.name == "delPrivate") {
            var _tmplCode = getQueryString("tmplcode");
            var key = window.location.pathname + "/" + _tmplCode + "|" + grid.id + "|";
            if (typeof (Storage) === "undefined") {
                menu.hide();
                return;
            }
            else {
                localStorage.removeItem(key + "top");
                localStorage.removeItem(key + "bottom");
                menu.hide();
                window.location.reload();
            }

        }
    }
};

/*-------------------------------------------------------------------------------平台自定义计算服务--------------------------------------------------------------------------------*/

function formItemCal(e, itemName, filedName, calSettings) {
    if (!itemName) {
        msgUI("必须指定控件的name，才能进行计算"); return;
    }
    var settings = jQuery.extend(true, {}, executeParamSettings, calSettings);
    var formCode = getQueryString("TmplCode");
    var form = new mini.Form(normalParamSettings.formId);
    if (!form) {
        msgUI("根据表单自定义计算，必须要有表单数据作为上下文"); return;
    }

    var url = "/MvcConfig/Meta/Calculate/CalculateFormExpressionWithItem";
    if (filedName) {
        addExecuteParam("TriggerField", filedName);
    }
    addExecuteParam("FormCode", formCode);
    addExecuteParam("FormItemCode", itemName);
    execute(url, {
        showLoading: true, loadingInterval: 0, refresh: false, onComplete: function (data) {
            form.setData(data);
            $("form .mini-datagrid").each(function () {
                var id = $(this).attr("id");
                if ((data || 0)[id] != undefined)
                    mini.get(id).setData(mini.decode(data[id]));
            });

            $("form .mini-treegrid").each(function () {
                var id = $(this).attr("id");
                if ((data || 0)[id] != undefined)
                    mini.get(id).setData(mini.decode(data[id]));
            });
            if (typeof (settings.OnCalComplete) != "undefined" && settings.OnCalComplete) {
                settings.OnCalComplete(e, data, filedName)
            }
        }, validateForm: false
    });
}

function formCal(calSettings) {
    var formCode = getQueryString("TmplCode");
    var form = new mini.Form(normalParamSettings.formId);
    if (!form) {
        msgUI("根据表单自定义计算，必须要有表单数据作为上下文"); return;
    }
    var settings = jQuery.extend(true, {}, executeParamSettings, calSettings);
    var url = "/MvcConfig/Meta/Calculate/CalculateFormExpression";
    addExecuteParam("FormCode", formCode);
    execute(url, {
        showLoading: true, loadingInterval: 0, refresh: false, onComplete: function (data) {
            form.setData(data);
            $("form .mini-datagrid").each(function () {
                var id = $(this).attr("id");
                if ((data || 0)[id] != undefined)
                    mini.get(id).setData(mini.decode(data[id]));
            });
            $("form .mini-treegrid").each(function () {
                var id = $(this).attr("id");
                if ((data || 0)[id] != undefined)
                    mini.get(id).setData(mini.decode(data[id]));
            });
            if (typeof (settings.OnCalComplete) != "undefined" && settings.OnCalComplete) {
                settings.OnCalComplete(e, data)
            }
        }, validateForm: false
    });
}

function calFormExpression(formDefineCode, formData, calSettings) {
    if (!formData) {
        var form = new mini.Form(normalParamSettings.formId);
        if (form) {
            formData = form.getData();
        }
    }
    if (!formData) {
        msgUI("根据表单自定义计算，必须要有表单数据作为上下文"); return;
    }
    var settings = jQuery.extend(true, {}, executeParamSettings, calSettings);
    var url = "/MvcConfig/Meta/Calculate/CalculateFormExpression";
    addExecuteParam("FormCode", formDefineCode);
    execute(url, {
        showLoading: true, loadingInterval: 0, refresh: false, onComplete: function (data) {
            if (typeof (settings.OnCalComplete) != "undefined" && settings.OnCalComplete) {
                settings.OnCalComplete(e, data)
            }
        }, validateForm: false
    });
}

/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/