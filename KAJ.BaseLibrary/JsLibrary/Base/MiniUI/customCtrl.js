/*--------------下载控件全局变量--------------*/
if (typeof fileSizeLimit == "undefined")
    fileSizeLimit = '500MB'; //swf的控制，在MvcAdapter中的GetBasicInfo中根据配置文件重写
if (typeof fileTypeExts == "undefined")
    fileTypeExts = "";    //swf的控制，在MvcAdapter中的GetBasicInfo中根据配置文件重写
if (typeof swfUploadHost == "undefined") //swf上传文件的主机地址
    swfUploadHost = "";
if (typeof fileViewMode == "undefined") //在线浏览类型，在MvcAdapter中的GetBasicInfo中根据配置文件重写
    fileViewMode = false;


/*------------------file ---------------------*/

var UploadUrl = swfUploadHost + "/FileStore/SWFUpload/FileUploadHandler.ashx";
var checkUrl = swfUploadHost + "/FileStore/SWFUpload/FileCheckHandler.ashx";  //uploadifile控件使用
var DownloadUrl = getRootPath() + "/FileStore/Download.aspx";
var ViewerUrl = getRootPath() + "/MvcConfig/ViewFile/ViewerSWF";
if (fileViewMode == 'pdfviewer')
    ViewerUrl = getRootPath() + "/MvcConfig/ViewFile/ViewerPDF";
else if (fileViewMode == 'tilepicviewer')
    ViewerUrl = tilePicViewerUrl;

function getFile(url, fileId) {
    var result = "";
    $.ajax({
        url: url,
        type: "post",
        data: { id: fileId },
        cache: false,
        async: false,
        success: function (text) {
            //增加新版报错分支
            if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                var fail = jQuery.parseJSON(text);
                var msg = getErrorFromHtml(fail.errmsg);
                msgUI(msg, 4);
                return;
            }
            else
                result = text;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var msg = "提交服务器失败";
            msgUI(msg, 4);
        }
    });
    window.location.href = url + "?auth=" + result;
}

function getRootPath() {
    //var pathName = window.location.pathname.substring(1);
    //var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    return window.location.protocol + '//' + window.location.host;
}


//将文件Id中的文件名处理掉
function fixFileIds(fileIds) {
    var result = fileIds.replace(/[^_,0-9]/g, function (n) {
        return "";
    }).replace(/_+/g, "_");

    return result;
}

function DownloadFile(fileId, downLoadFileName) {
    if (fileId == "")
        return false;
    var url = DownloadUrl;
    var result = "";
    $.ajax({
        url: url,
        type: "post",
        data: { id: fileId },
        cache: false,
        async: false,
        success: function (text) {
            //增加新版报错分支
            if (text && typeof (text) == "string" && text.indexOf("{\"errcode\"") == 0) {
                var fail = jQuery.parseJSON(text);
                var msg = getErrorFromHtml(fail.errmsg);
                msgUI(msg, 4);
                return;
            }
            else
                result = text;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var msg = "提交服务器失败";
            msgUI(msg, 4);
        }
    });
    var downLoadUrl = url + "?auth=" + result;
    if (downLoadFileName) {
        downLoadUrl += "&DownLoadFileName=" + downLoadFileName;
    }
    window.location.href = downLoadUrl;
}

function loadUploadifyResource(callback) {
    //includeCSS("Uploadify_CSS", "/CommonWebResource/RelateResource/Uploadify/uploadify.css");
    //ajaxPage("Uploadify_JS", "/CommonWebResource/RelateResource/Uploadify/jquery.uploadify.min.js", callback);

    includeCSS("Uploadify_CSS", "/CommonWebResource/RelateResource/Uploadify/uploadifive.css");
    ajaxPage("Uploadify_JS", "/CommonWebResource/RelateResource/Uploadify/jquery.uploadifive.min.js", callback);

}

function getUploadifySettting(miniFile) {
    var setting = {};
    if ($.trim(miniFile.maximumupload) != "") {
        setting["fileSizeLimit"] = miniFile.maximumupload;
    }
    if ($.trim(miniFile.maxnumbertoupload) != "") {
        setting["uploadlimit"] = parseInt(miniFile.maxnumbertoupload);
    }
    return setting;
}

//--------------------------------mini-MultiFile对象定义开始 从mini-Panel继承----------------------------------------
mini.ux.MultiFile = function () {
    mini.ux.MultiFile.superclass.constructor.call(this);

    this.files = [];
    this.initControls();
    this.initEvents();
}
mini.extend(mini.ux.MultiFile, mini.Splitter, {
    formField: true,
    width: "100%",
    height: 120,
    allowResize: false,
    handlerSize: 0,
    required: false, //是否必填
    readonly: false, //是否只读
    downloadDisabled: false, //是否下载
    disabled: false, //是否禁用
    perrowcount: 2, //每行文件数
    maximumupload: "", //上传的最大文件大小
    maxnumbertoupload: "", //上传的最大文件数量
    fileType: "",
    allowthumbnail: false, //是否缩略图
    src: "system", //所属系统模块
    uiCls: "mini-multifile",
    uploadifyID: "",

    initControls: function () {
        this.setPanes([{ showCollapseButton: false, style: "border-right:0px;overflow-y:auto;overflow-x:none" }, { size: 40, showCollapseButton: false }]);
        var paneBtn = this.getPaneEl(2);
        var uploadHTML = "<a name='btnAdd' class='mini-button' plain=\"true\" iconCls=\"icon-extend-upload\" tooltip=\"上传\"></a>";

        this.uploadifyID = "multifile_uploadify_" + this.id;
        uploadHTML = "<span class=\"uploadify-multi-button " + this.uploadifyID + "\" title=\"上传\"></span>"
        var btnHtml = "<table width=\"100%\" height=\"100%\" style=\"background-color:#F0F0F0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td style=\"vertical-align:top\">"
            + "<table cellpadding=\"0\" cellspacing=\"0\" align=\"center\">"
            + "<tr id=\"upload\"><td>" + uploadHTML + "</td></tr>"
            + "<tr id=\"clear\"><td><a name='btnClear' class='mini-button' plain=\"true\" iconCls=\"icon-extend-checked\" tooltip=\"全选\"></a></td></tr>"
            + "<tr id=\"delete\"><td><a name='btnDel' class='mini-button' plain=\"true\" iconCls=\"icon-extend-filedelete\" tooltip=\"删除\"></a></td></tr>"
            + "<tr id=\"download\"><td><a name='btnDownload' class='mini-button' plain=\"true\" iconCls=\"icon-extend-download\" tooltip=\"下载\"></a></td></tr>"
            + "</table></td></tr></table>";
        paneBtn.innerHTML = btnHtml;
        mini.parse(this.el);
        var attrs = mini.ux.MultiFile.superclass.getAttrs.call(this, this.el);
        this.FilePaneEl = this.getPaneEl(1);
        if (this.uploadifyID == "") {
            this._btnAdd = mini.getbyName("btnAdd", this);
        }
        this._btnDel = mini.getbyName("btnDel", this);
        this._btnDownload = mini.getbyName("btnDownload", this);
        this._btnClear = mini.getbyName("btnClear", this);
    },
    initEvents: function () {
        if (this.uploadifyID == "") {
            this._btnAdd.on("click", function (e) {
                //弹上传页面，并取返回值
                this.uploadFile();
            }, this);
        }
        this._btnDel.on("click", function (e) {
            var delFileChecked = $(this.FilePaneEl).find("input:checked");
            if (delFileChecked.length == 0) {
                msgUI("当前没有勾选要删除的文件，请重新检查！", 1);
                return;
            }
            var ctrl = this;
            msgUI("确认要删除文件吗？", 2, function (action) {
                if (action == "ok") {
                    //获取内容区选中checkbox，并移除
                    var delFiles = [];
                    $.each(delFileChecked, function (i, val) {
                        delFiles.push($(val).val());
                    });
                    delFilesCallback(ctrl.id);
                }
            });
        }, this);
        this._btnDownload.on("click", this.downloadFiles, this);
        this._btnClear.on("click", function (e) {
            //清除内容区的内容
            var bodyEl = this.FilePaneEl;
            var fileIds = this.getValue();
            if (fileIds == "") return;
            var ctrlId = this.id;
            //msgUI("确认要删除所有文件吗？", 2,
            //    function (action) {
            //        if (action == "ok") {
            //            clearFilesCallback(ctrlId);
            //        }
            //    }
            //);
            var delFileChecked = $(this.FilePaneEl).find("input:checked");
            $(this.FilePaneEl).find("input").prop('checked', delFileChecked.length > 0 ? false : true);
        }, this);
    },
    setValue: function (files) {
        this.files = files && files != "" ? files.split(',') : [];
        this.renderFiles();
    },
    addValue: function (files) {
        if (files && files != "") {
            var oldFiles = this.files.length > 0 ? this.files.join(",") + "," : "";
            this.files = (oldFiles + files).split(",");
            this.renderFiles();
            //新增触发新增文件change
            this.fire("change");
        }
    },
    removeValue: function () {
        var delFileChecked = $(this.FilePaneEl).find("input:checked");
        if (delFileChecked.length > 0) {
            var arrdelfiles = [];
            $.each(delFileChecked, function (i, val) {
                arrdelfiles.push($(val).val());
            });
            if (arrdelfiles.length > 0) {
                var newfiles = [];
                $.each(this.files, function (i, val) {
                    if ($.inArray(val, arrdelfiles) == -1) {
                        newfiles.push(val);
                    }
                });
                this.files = newfiles;
                this.renderFiles();
                //新增触发删除文件change
                this.fire("change");
            }
        }
    },
    renderFiles: function () {
        var bodyHtml = "";
        var ctrlId = this.id;

        $.each(this.files, function (i, file) {
            if ($.trim(file) != "") {
                var filename = getMiniFileName(file);
                var fileId = file.substring(0, file.indexOf("_"));

                var viewer = '<img title="浏览" src="/CommonWebResource/RelateResource/image/magnifier.png" style="margin-left:10px;cursor:pointer;vertical-align:middle;" onclick="viewerFile(\'' + (fileId + '_' + filename) + '\')" style="text-decoration: underline;color: #1122CC;cursor:pointer;"/>';
                bodyHtml += "<span><table width=100%><tbody><tr>"
                    + "<td align='right' width='20'><input type='checkbox' id='_FileId' value='" + file.replace(/\'/g, "&#39;") + "'></td>"
                    + "<td width='5'></td>"
                    + "<td align='left'><span class='MultiMode_FileName' id='_FileName'><a fileid='" + fileId + "' file='" + file.replace(/\'/g, "&#39;") + "' style='text-decoration: underline;cursor:hand;color: #1122CC;cursor:pointer;font-size:12px;'>" + filename + "</a>"
                    + (fileViewMode != 'none' ? fileViewerFormat(filename) ? viewer : "" : "") + "</span></td>"
                    + "</tr></tbody></table></span>";
            }
        });
        this.FilePaneEl.innerHTML = bodyHtml;
        if (!this.downloadDisabled && !this.disabled) {
            $(this.FilePaneEl).find("a").each(function (i) {
                $(this).bind("click", function () { DoViewFile($(this).attr("fileid"), $(this).attr("file")); });
            });
        }
    },
    getValue: function () {
        var value = this.files.join(",");
        return value;
    },
    getText: function () {
        var arrFiles = this.getValue().split(',');
        var txt = "";
        $.each(arrFiles, function (i, file) {
            if ($.trim(file) != "") {
                var filename = getMiniFileName(file);
                txt += filename;
                if (i < arrFiles.length - 1)
                    txt += ",";
            }
        });
        return txt;
    },
    setReadOnly: function (isReadonly) {
        if (isReadonly) {
            this.readonly = true;
            this.addCls("mini-multifile-readonly");
            if (this.uploadifyID != "") {
                $("." + this.uploadifyID).hide();
                $("#" + this.uploadifyID).parent().hide();
            } else
                this._btnAdd.hide();
            this._btnDel.hide();
            this._btnClear.hide();
        }
        else {
            this.readonly = false;
            this.removeCls("mini-multifile-readonly");
            if (this.uploadifyID != "")
                $("#" + this.uploadifyID).parent().show();
            else
                this._btnAdd.show();
            this._btnDel.show();
            this._btnClear.show();
        }
    },
    setDisabled: function (isDisabled) {
        if (isDisabled) {
            this.disabled = true;
            this.addCls("mini-multifile-disabled");
            this.disable();
            $(this.FilePaneEl).find("input[type='checkbox']").prop("disabled", true);
            $(this.FilePaneEl).find("a").each(function (i) {
                $(this).unbind("click");
            });
            $(this.FilePaneEl).find("#_FileName").prop("disabled", true);
            if (this.uploadifyID != "") {
                $("#" + this.uploadifyID).css("disabled", true);
            } else
                this._btnAdd.disable();
            this._btnDel.disable();
            this._btnClear.disable();
            this._btnDownload.disable();
        }
        else {
            this.disabled = false;
            this.removeCls("mini-multifile-disabled");
            this.enable();
            $(this.FilePaneEl).find("input[type='checkbox']").prop("disabled", false);
            $(this.FilePaneEl).find("a").each(function (i) {
                $(this).bind("click", function () { DoViewFile($(this).attr("fileid"), $(this).attr("file")); });
            });
            $(this.FilePaneEl).find("#_FileName").prop("disabled", false);
            if (this.uploadifyID != "")
                $("#" + this.uploadifyID).uploadify('disable', false);
            else
                this._btnAdd.enable();
            this._btnDel.enable();
            this._btnClear.enable();
            this._btnDownload.enable();
        }
    },
    setDownloadDisabled: function (isDisabled) { //使用该方法，请先调用setReadOnly
        if (isDisabled) {
            this.downloadDisabled = true;
            $(this.FilePaneEl).find("a").each(function (i) {
                $(this).unbind("click");
            });
            this._btnDownload.disable();
        }
        else {
            this.downloadDisabled = false;
            $(this.FilePaneEl).find("a").each(function (i) {
                $(this).bind("click", function () { DoViewFile($(this).attr("fileid"), $(this).attr("file")); });
            });
            this._btnDownload.enable();
        }
    },
    setRequired: function (isRequired) {
        if (isRequired && isRequired != "false") {
            this.required = true;
            this.addCls("mini-required");
        }
        else {
            this.required = false;
            this.removeCls("mini-required");
        }
    },
    validate: function () {
        var isVal = this.isValid();
        var errorId = this.id + "-errorIcson";
        if (!isVal) {
            if ($("#" + errorId).length == 0) {
                //添加error图标
                var imgError = $("<img id='" + errorId + "' src='/CommonWebResource/Theme/Default/MiniUI/images/panel/error.gif' width='14' height='14' title='不能为空' />");
                $("#" + this.id).after(imgError);
            }
            return false;
        }
        else {
            $("#" + errorId).remove();
            return true;
        }
    },
    isValid: function () {
        if (this.required) {
            if (this.getValue() != "") {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    },
    downloadFiles: function () {
        if (this.files.length > 0) {
            var arr = [];
            for (var i = 0; i < this.files.length; i++) {
                var FileAllName = this.files[i].replace(/\'/g, "\\\'");
                if ($("input[value='" + FileAllName + "']").attr("checked") == "checked")
                    arr.push(FileAllName.substr(0, FileAllName.indexOf('_')));
            }
            if (arr.length > 0)
                DownloadFile(escape(arr.join(",")));
            else
                msgUI("请选择要下载的文件！");
        }
    },
    getAttrs: function (el) {
        var attrs = mini.ux.MultiFile.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            [
                "required", "readonly", "disabled", "perrowcount", "maximumupload", "maxnumbertoupload", "fileType", "allowthumbnail", "src", "requiredErrorText", "errorText", "onchange"]
        );
        return attrs;
    }
});

function DoViewFile(fileId, file) {
    if (!file)
        return;
    getFile(DownloadUrl, fileId);
}

function delFilesCallback(ctrlId) {
    if (ctrlId == "")
        return;
    var miniCtrl = mini.get(ctrlId);
    miniCtrl.removeValue();
}

function clearFilesCallback(ctrlId) {
    if (ctrlId == "")
        return;
    var minictrl = mini.get(ctrlId);
    minictrl.setValue("");
}


function Encrypt(str, pwd) {
    if (str == "") return "";
    str = escape(str);
    if (!pwd || pwd == "") { var pwd = "abcd123456"; }
    pwd = escape(pwd);
    if (pwd == null || pwd.length <= 0) {
        alert("Please enter a password with which to encrypt the message.");
        return null;
    }
    var prand = "";
    for (var I = 0; I < pwd.length; I++) {
        prand += pwd.charCodeAt(I).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.ceil(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
        alert("Algorithm cannot find a suitable hash. Please choose a different password. /nPossible considerations are to choose a more complex or longer password.");
        return null;
    }
    var salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (var I = 0; I < str.length; I++) {
        enc_chr = parseInt(str.charCodeAt(I) ^ Math.floor((prand / modu) * 255));
        if (enc_chr < 16) {
            enc_str += "0" + enc_chr.toString(16);
        } else
            enc_str += enc_chr.toString(16);
        prand = (mult * prand + incr) % modu;
    }
    salt = salt.toString(16);
    while (salt.length < 8) salt = "0" + salt;
    enc_str += salt;
    return enc_str;
}

function Decrypt(str, pwd) {
    if (str == "") return "";
    if (!pwd || pwd == "") { var pwd = "abcd123456"; }
    pwd = escape(pwd);
    if (str == null || str.length < 8) {
        alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
        return;
    }
    if (pwd == null || pwd.length <= 0) {
        alert("Please enter a password with which to decrypt the message.");
        return;
    }
    var prand = "";
    for (var I = 0; I < pwd.length; I++) {
        prand += pwd.charCodeAt(I).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.round(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    var salt = parseInt(str.substring(str.length - 8, str.length), 16);
    str = str.substring(0, str.length - 8);
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (var I = 0; I < str.length; I += 2) {
        enc_chr = parseInt(parseInt(str.substring(I, I + 2), 16) ^ Math.floor((prand / modu) * 255));
        enc_str += String.fromCharCode(enc_chr);
        prand = (mult * prand + incr) % modu;
    }
    return unescape(enc_str);
}

function viewerFile(fullName) {
    function gFileID() {
        if (fullName.indexOf('_') > 0)
            return fullName.substring(0, fullName.indexOf('_'));
        else
            return fullName;
    }
    function gUser() {
        return Encrypt(user.UserID + '.' + user.UserName + '.' + user.UserOrgName);
    }
    if (fileViewMode == 'tilepicviewer') {
        openWindow(ViewerUrl + '?ID=' + gFileID() + '&User=' + gUser(), { title: '浏览', gridId: 'dataGrid', width: '85%', height: 600 });
    } else {
        openWindow(ViewerUrl + '?FileID=' + escape(fullName), { title: '浏览', gridId: 'dataGrid' });
    }
}
function fileViewerFormat(filename) {
    var isView = false;
    if (filename && filename.lastIndexOf('.') >= 0) {
        var format = filename.substring(filename.lastIndexOf('.') + 1)
        if (typeof (convertFileViewerFormat) != "undefined" && convertFileViewerFormat) {
            var arr = convertFileViewerFormat.split(',');
            for (var i = 0; i < arr.length; i++) {
                if (format.toLowerCase() == arr[i].toLowerCase()) {
                    isView = true;
                }
            }
        }
    }
    return isView;
}
mini.regClass(mini.ux.MultiFile, "multifile");

//--------------------------------mini-SingleFile对象定义开始 从mini-Control继承----------------------------------------
mini.ux.SingleFile = function () {
    mini.ux.SingleFile.superclass.constructor.call(this);
    this.file = "";
    this.initControls();
    this.initEvents();
}

mini.extend(mini.ux.SingleFile, mini.Control, {
    formField: true,
    title: "上传",
    width: 200,
    required: false, //是否必填
    readonly: false, //是否只读
    disabled: false, //是否禁用
    maximumupload: "", //上传的最大文件大小
    maxnumbertoupload: "1", //上传的最大文件数量
    fileType: "",//上传的文件类型
    allowthumbnail: false, //是否缩略图
    src: "system", //所属系统模块
    uiCls: "mini-singlefile",
    uploadifyID: "",
    initControls: function () {
        mini.parse(this.el);
        var attrs = mini.ux.SingleFile.superclass.getAttrs.call(this, this.el);
        var $border = $("<span>").addClass("mini-singlefile-border");
        $border.append($("<input>").attr("type", "text").addClass("mini-singlefile-input").attr("readonly", "readonly"));
        var $icon = $("<span>").addClass("mini-singlefile-buttons");
        if (fileViewMode != 'none')
            $icon.append($("<span>").addClass("mini-singlefile-viewer").attr("title", "浏览"));
        $icon.append($("<span>").addClass("mini-singlefile-remove").attr("title", "删除"));
        this.uploadifyID = "singlefile_uploadify_" + this.id;
        $icon.append(($("<span>").addClass("uploadify-single-button")).append($("<input>").attr("id", this.uploadifyID).attr("type", "file")));
        $border.append($icon);
        $(this.el).append($border);
        this._fileBorder = $border;
        this._txtDownLoad = $(this.el).find("input.mini-singlefile-input");
        this._btnRemove = $(this.el).find("span.mini-singlefile-remove");
        this._btnViewer = $(this.el).find("span.mini-singlefile-viewer");
        if (this.uploadifyID == "")
            this._btnUpLoad = $(this.el).find("span.mini-singlefile-upload");
        else
            this._btnUpLoad = $(this.el).find(".uploadify-single-button");
    },
    initEvents: function () {
        var ctrl = this;
        this._txtDownLoad.click(function (event) {
            ctrl.downloadFile();
        });
        this._btnRemove.click(function (event) {
            ctrl.removeValue();
        });
        if (this.uploadifyID == "") {
            this._btnUpLoad.click(function (event) {
                ctrl.uploadFile();
            });
        }
        this._btnViewer.click(function (event) {
            ctrl.viewerFile();
        });
        if (this.uploadifyID == "") {
            this._btnUpLoad.parent().mouseover(function (event) {
                if (ctrl.enabled)
                    ctrl._btnUpLoad.parent().addClass("mini-singlefile-button-hover");
            });
            this._btnUpLoad.parent().mouseout(function (event) {
                ctrl._btnUpLoad.parent().removeClass("mini-singlefile-button-hover");
            });
        }
        mini.on(this._txtDownLoad[0], "change", this.__OnChange, this);
    },
    render: function () {
        var filename = getMiniFileName(this.file);
        this._txtDownLoad.attr("value", filename).change();
        this._txtDownLoad.attr("title", filename);
        if (filename) {
            if (fileViewerFormat(filename)) {
                $(".mini-singlefile-viewer").show();
            } else {
                $(".mini-singlefile-viewer").hide();
            }
        }
    },
    setValue: function (file) {
        this.file = $.trim(file);
        this.render();
    },
    getValue: function () {
        return $.trim(this.file);
    },
    getText: function () {
        var filename = getMiniFileName(this.getValue());
        return filename;
    },
    setReadOnly: function (isReadonly) {
        if (isReadonly) {
            this.readonly = true;
            this.addCls("mini-singlefile-readonly");
            this._btnRemove.hide();
            if (this.uploadifyID == "")
                this._btnUpLoad.parent().hide();
            else
                this._btnUpLoad.hide();
        }
        else {
            this.readonly = false;
            this.removeCls("mini-singlefile-readonly");
            this._btnRemove.show();
            if (this.uploadifyID == "")
                this._btnUpLoad.parent().show();
            else
                this._btnUpLoad.show();
        }
    },
    setDisabled: function (isDisabled) {
        if (isDisabled) {
            this.disabled = true;
            this.addCls("mini-singlefile-disabled");
            this._txtDownLoad.attr("disabled", true);
            this._btnRemove.unbind("click");
            if (this.uploadifyID == "") {
                this._btnUpLoad.unbind("click");
                this._btnUpLoad.parent().unbind();
            }
        }
        else {
            this.disabled = false;
            this.removeCls("mini-singlefile-disabled");
            this._txtDownLoad.removeAttr("disabled");
            var ctrl = this;
            this._btnRemove.click(function (event) {
                ctrl.removeValue();
            });
            if (this.uploadifyID == "") {
                this._btnUpLoad.click(function (event) {
                    ctrl.uploadFile();
                });
                this._btnUpLoad.parent().mouseover(function (event) {
                    if (ctrl.enabled) {
                        ctrl._btnUpLoad.parent().addClass("mini-singlefile-button-hover");
                    }
                });
                this._btnUpLoad.parent().mouseout(function (event) {
                    ctrl._btnUpLoad.parent().removeClass("mini-singlefile-button-hover");
                });
            }
        }
        if (this.uploadifyID != "") {
            try {
                $("#" + this.uploadifyID).uploadify('disable', this.disabled);
            } catch (e) { }
        }
    },
    setDownloadDisabled: function (isDisabled) { //使用该方法，请先调用setReadOnly
        if (isDisabled) {
            this._txtDownLoad.unbind("click");
        }
        else {
            var ctrl = this;
            this._txtDownLoad.click(function (event) {
                ctrl.downloadFile();
            });
        }
    },
    setRequired: function (isRequired) {
        if (isRequired && isRequired != "false") {
            this.required = true;
            this.addCls("mini-required");
        }
        else {
            this.required = false;
            this.removeCls("mini-required");
        }
    },
    validate: function () {
        var isVal = this.isValid();
        var errorId = this.id + "-errorIcon";
        if (!isVal) {
            if ($("#" + errorId).length == 0) {
                //添加error图标
                var imgError = $("<img id='" + errorId + "' src='/CommonWebResource/Theme/Default/MiniUI/images/panel/error.gif' width='14' height='14' title='不能为空' />");
                $("#" + this.id).after(imgError);
            }
            return false;
        }
        else {
            $("#" + errorId).remove();
            return true;
        }
    },
    isValid: function () {
        if (this.required) {
            if (this.getValue() != "") {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    },
    addValue: function (value) {
        var oldValue = this.file;
        if ($.trim(oldValue) != "") {
            this.file = $.trim(value);
            callbackSetValue(this.id);
        }
        else {
            this.setValue(value);
        }
    },
    removeValue: function () {
        if ($.trim(this.file) != "") {
            var ctrl = this;
            var file = ctrl.file;
            msgUI("确认要删除文件吗？", 2,
                function (action) {
                    if (action == "ok") {
                        ctrl.file = "";
                        callbackSetValue(ctrl.id);
                    }
                }
            );
        }
    },
    downloadFile: function () {
        if ($.trim(this.file) != "") {
            DownloadFile(escape(this.file));
        }
    },
    viewerFile: function () {
        if ($.trim(this.file) != "") {
            var id = this.file.substr(0, this.file.lastIndexOf('_'));
            viewerFile(id);
        }
    },
    getAttrs: function (el) {
        var attrs = mini.ux.SingleFile.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            [
                "required", "readonly", "disabled", "maximumupload", "fileType", "allowthumbnail", "src", "onchange", "requiredErrorText", "errorText"]
        );
        return attrs;
    },
    __OnChange: function (e) {
        var t = mini.findParent(e.target, "mini-singlefile");
        if (t) {
            var val = this.getValue();
            var ev = {
                sender: this,
                value: val,
                text: this.getText(),
                downloadValue: DownloadUrl + "?FileId=" + val
            };
            this.fire("change", ev);
        }
    }
});

function callbackSetValue(ctrlId) {
    if (ctrlId == "")
        return;
    var minictrl = mini.get(ctrlId);
    var val = minictrl.file;
    minictrl.setValue(val);
}

mini.regClass(mini.ux.SingleFile, "singlefile");

//--------------------------------File-Uploadify--------------------------------------------------
$(function () {
    //2017-7-21 列表页面加载uploadify.js会与mini grid表头计算冲突
    if ($(".mini-multifile, .mini-singlefile, .mini-fileupload").length > 0) {

        loadUploadifyResource(initUploadify);
    }
    else {
        var _existGridEditor = false;//当表单子表有单附件控件时
        $(".mini-grid").each(function (index, item) {
            if (item.id) {
                var grid = mini.get(item.id);
                if (grid && grid.getColumns) {
                    var columns = grid.getColumns();
                    for (var i = 0; i < columns.length; i++) {
                        var column = columns[i];
                        if (column.editor && column.editor.cls && column.editor.cls == "mini-fileupload") {
                            _existGridEditor = true;
                            return false;
                        }
                    }
                }
            }
        });
        if (_existGridEditor)
            loadUploadifyResource(initUploadify);
    }

    function initUploadify() {
        var queueID = "fileQueue_mini";
        $("body").append($("<div>").attr("id", queueID).css("z-index", "1000").addClass("uploadify-fileQueue"));

        var fileCtrlIds = {};

        $.each($(".mini-multifile"), function (i, dom) {
            var miniFile = mini.getbyUID(dom.uid);
            var fileID = miniFile.uploadifyID;
            $(miniFile.getEl()).find("table table tr td:eq(0) span.uploadify-multi-button").append($("<input>").attr("type", "file").attr("id", fileID));
            var uid = miniFile.uid;
            $("#" + fileID).uploadifive($.extend({
                'multi': true,
                'auto': true,
                'checkScript': checkUrl,
                'formData': { src: miniFile.src },
                fileType: miniFile.fileType,
                'queueID': queueID,
                'removeCompleted': false,
                uploadScript: UploadUrl,
                fileSizeLimit: fileSizeLimit,
                'buttonClass': "mini-multifile-upload",
                buttonText: "",
                width: 41,
                height: 25,
                onFallback: function () {
                    alert("该浏览器无法使用H5 上传控件，请确认是否是IE10 及 以上版本!");
                },
                'onCheck': function (file, exists) {
                    if (exists) {
                        alert('【' + file.name + '】' + '文件格式【' + file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length) + '】被限制上传！');
                    }
                    try { mini.hideMessageBox(this[0].loadingMessageId); } catch (e) { }
                },
                onUploadComplete: function (file, data, response) {
                    mini.getbyUID(uid).addValue(data);
                    $(".uploadifive-queue-item.complete").hide();
                    if (this[0].loadingMessageId) {
                        try {
                            mini.hideMessageBox(this[0].loadingMessageId);
                        } catch (e) { }
                    }
                },
                onUpload: function (filesToUpload) {
                    if (filesToUpload > 0) {
                        this[0].loadingMessageId = mini.loading("文件上传中...", "上传中", { width: 300 });
                        if (miniFile.readonly) {
                            $("#" + fileID).hide();
                        }
                        if (miniFile.disabled) {
                            $("#" + fileID).uploadify('disable', true);
                        }
                    }
                },
                onError: function (errorType, file) {
                    var msg = "上传错误，FileStore配置出错！";
                    switch (errorType) {
                        case 'UPLOAD_LIMIT_EXCEEDED':
                            msg = "上传的文件数量已经超出系统限制";
                            break;
                        case 'FILE_SIZE_LIMIT_EXCEEDED':
                            msg = "文件 [" + file.name + "] 大小超出系统限制的" + fileSizeLimit;
                            break;
                        case 'QUEUE_LIMIT_EXCEEDED':
                            msg = "任务数量超出队列限制";
                            break;
                        case 'FORBIDDEN_FILE_TYPE':
                            msg = "文件 [" + file.name + "] 类型不正确！";
                            break;
                        case '404_FILE_NOT_FOUND':
                            msg = "文件未上传成功，请联系管理员";
                            break;
                    }
                    msgUI(msg);
                    if (this[0].loadingMessageId) {
                        try {
                            mini.hideMessageBox(this[0].loadingMessageId);
                        } catch (e) {

                        }
                    }
                },
                onAddQueueItem: function (file) {

                }
            }, getUploadifySettting(miniFile)));
        });

        $.each($(".mini-singlefile"), function (i, dom) {
            var miniFile = mini.getbyUID(dom.uid);
            var fileID = miniFile.uploadifyID;
            var uid = miniFile.uid;
            $("#" + miniFile.uploadifyID).uploadifive($.extend({
                'multi': false,
                'auto': true,
                'checkScript': checkUrl,
                'formData': { src: miniFile.src },
                fileType: miniFile.fileType,
                'queueID': queueID,
                uploadScript: UploadUrl,
                fileSizeLimit: fileSizeLimit,
                buttonClass: "mini-singlefile-upload",
                buttonText: "",
                width: 41,
                height: 25,
                onFallback: function () {
                    alert("该浏览器无法使用!");
                },
                'onCheck': function (file, exists) {
                    if (exists) {
                        alert('【' + file.name + '】' + '文件格式【' + file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length) + '】被限制上传！');
                    }
                    try { mini.hideMessageBox(this[0].loadingMessageId); } catch (e) { }
                },
                onUploadComplete: function (file, data, response) {
                    mini.getbyUID(uid).addValue(data);
                    $(".uploadifive-queue-item.complete").hide();
                    if (this[0].loadingMessageId) {
                        try {
                            mini.hideMessageBox(this[0].loadingMessageId);
                        } catch (e) { }
                    }
                },
                onUpload: function (filesToUpload) {
                    if (filesToUpload > 0) {
                        this[0].loadingMessageId = mini.loading("文件上传中...", "上传中", { width: 300 });
                        if (miniFile.readonly) {
                            $("#" + fileID).hide();
                        }
                        if (miniFile.disabled) {
                            $("#" + fileID).uploadify('disable', true);
                        }
                    }
                },
                onError: function (errorType, file) {
                    var msg = "上传错误，FileStore配置出错！";
                    switch (errorType) {
                        case 'UPLOAD_LIMIT_EXCEEDED':
                            msg = "上传的文件数量已经超出系统限制";
                            break;
                        case 'FILE_SIZE_LIMIT_EXCEEDED':
                            msg = "文件 [" + file.name + "] 大小超出系统限制的 " + fileSizeLimit;
                            break;
                        case 'QUEUE_LIMIT_EXCEEDED':
                            msg = "任务数量超出队列限制";
                            break;
                        case 'FORBIDDEN_FILE_TYPE':
                            msg = "文件 [" + file.name + "] 类型不正确！";
                            break;
                        case '404_FILE_NOT_FOUND':
                            msg = "文件未上传成功，请联系管理员";
                            break;
                    }
                    msgUI(msg);
                    if (this[0].loadingMessageId) {
                        try {
                            mini.hideMessageBox(this[0].loadingMessageId);
                        } catch (e) {

                        }
                    }
                },
                onAddQueueItem: function (file) {

                }
            }, getUploadifySettting(miniFile)));
        });

    }
});


//--------------------------------mini-AuditSign会签控件------------------------------------------

mini.ux.AuditSign = function () {
    mini.ux.AuditSign.superclass.constructor.call(this);
    this.initScript();
}

mini.extend(mini.ux.AuditSign, mini.Control, {
    formField: true,
    uiCls: "mini-auditsign",
    defaultTmpl: "/MvcConfig/auditSignTmpl.js", //审批签名模板
    tmplurl: "", //自定义模板
    tmplItem: "AuditItem",
    tmplName: "auditSignTmpl",
    signTitle: "",
    initScript: function () {
        ajaxPage(this.tmplName, this.defaultTmpl);
    },
    render: function () {
        var renderHTML = "";
        var itemName = this.tmplItem;
        var tmplName = this.tmplName;
        var signTitle = this.signTitle;
        var data = this.dataField;
        if ($.trim(this.tmplurl) == "" && this.dataField.length == 0) {
            data = [{ SignComment: "", ExecUserID: "", SignTime: "", StepName: "" }];
        }
        $.each(data, function (i, auditSign) {
            var tmpItem = eval(tmplName + "_AuditSignTempleteItem");
            tmpItem = tmpItem.replace("$SignTitle", signTitle);
            for (var prop in auditSign) {
                if (typeof (auditSign[prop]) == "string") {
                    var propVal = auditSign[prop];
                    if (prop == "SignTime" && $.trim(propVal) != "") {
                        propVal = $.trim(propVal);
                        propVal = propVal.replace("/", "-");
                        propVal = propVal.split(' ')[0];
                        //propVal = propVal.replace("-", "/");
                        //propVal = new Date(propVal).format("yyyy-MM-dd");

                    }
                    propVal = propVal.replace(/\$%/g, "<br/>");
                    tmpItem = tmpItem.replace("$" + prop, propVal).replace("$" + prop, propVal);
                }
            }
            if (i == data.length) {
                tmpItem = tmpItem.substr(0, tmpItem.lastIndexOf('<tr>'));
            }
            renderHTML += tmpItem;
        });
        this.el.innerHTML = eval(tmplName + "_AuditSignTemplete").replace("$" + itemName, renderHTML);
    },
    setTmplurl: function (url) {
        this.tmplName = getFileNameNoExt(url);
        ajaxPage(this.tmplName, url);
    },
    setValue: function (val) {
        if (typeof (val) == "string") {
            val = val.replace(/\\n/g, "$%"); //换行处理
            val = eval($.trim(val) == "" ? [] : val);
        }
        else if (typeof (val) == "undefined" || val == null)
            val = [];
        this.dataField = val;
        this.render();
    },
    //解决会签的并发的问题，去掉下面两个方法
    //    getValue: function () {
    //        if (typeof (this.dataField) == "undefined" || this.dataField == null)
    //            this.dataField = [];
    //        return mini.encode(this.dataField);
    //    },
    //    getFormValue: function () {
    //        if (typeof (this.dataField) == "undefined" || this.dataField == null)
    //            this.dataField = [];
    //        return mini.encode(this.dataField);
    //    },
    getAttrs: function (el) {
        var attrs = mini.ux.AuditSign.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            [
                "tmplurl", "tmplName", "signTitle"]
        );
        return attrs;
    }
});

mini.regClass(mini.ux.AuditSign, "auditsign");

//--------------------------------辅助方法------------------------------------------
function getFileNameNoExt(url) {
    var fileName = getFileName(url);
    return fileName.replace(getFileExt(fileName));
}

function getFileName(url) {
    var pos = url.lastIndexOf("/");
    if (pos == -1) {
        pos = url.lastIndexOf("\\")
    }
    var filename = url.substr(pos + 1)
    var ext = getFileExt(filename);
    return filename.replace(ext, "");
}

//取文件后缀名
function getFileExt(filepath) {
    if (filepath != "") {
        var pos = "." + filepath.replace(/.+\./, "");
        return pos;
    }
}

function ajaxPage(sId, url, callBack) {
    var oXmlHttp = getHttpRequest();
    oXmlHttp.onreadystatechange = function () {
        //4代表数据发送完毕
        if (oXmlHttp.readyState == 4) {
            //0为访问的本地，200代表访问服务器成功，304代表没做修改访问的是缓存
            if (oXmlHttp.status == 200 || oXmlHttp.status == 0 || oXmlHttp.status == 304) {
                includeJS(sId, oXmlHttp.responseText);
                if (typeof callBack == "function") {
                    callBack();
                }

            }
            else {
            }
        }
    }
    oXmlHttp.open("GET", url, false);
    oXmlHttp.send(null);
}

function includeJS(sId, source) {
    if ((source != null) && (!document.getElementById(sId))) {
        var myHead = document.getElementsByTagName("HEAD").item(0);
        var myScript = document.createElement("script");
        myScript.language = "javascript";
        myScript.type = "text/javascript";
        myScript.id = sId;
        try {
            myScript.appendChild(document.createTextNode(source));
        }
        catch (ex) {
            myScript.text = source;
        }
        myHead.appendChild(myScript);
    }
}

function includeCSS(sId, source) {
    if ((source != null) && (!document.getElementById(sId))) {
        var myHead = document.getElementsByTagName("HEAD").item(0);
        var node = document.createElement('link');
        node.rel = "stylesheet";
        node.type = 'text/css';
        node.id = sId;
        node.href = source;
        try {
            node.appendChild(document.createTextNode(source));
        }
        catch (ex) {
            node.text = source;
        }
        myHead.appendChild(node);
    }
}

function getHttpRequest() {
    if (window.ActiveXObject)//IE
    {
        return new ActiveXObject("MsXml2.XmlHttp");
    }
    else if (window.XMLHttpRequest)//其它
    {
        return new XMLHttpRequest();
    }
}

Date.prototype.format = function (format) //author: meizz
{
    if (!format)
        return format;
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
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

/*----------signpic控件------------------*/
mini.ux.SignPic = function () {
    mini.ux.SignPic.superclass.constructor.call(this);
    this.initControls();
}

mini.extend(mini.ux.SignPic, mini.Control, {
    uiCls: "mini-signpic",
    width: 80,
    height: 30,
    userId: "",
    src: "/MvcConfig/Image/GetSignPic?UserId=",
    noneImageSrc: "/CommonWebResource/RelateResource/image/signname.jpg",
    initControls: function () {
        var $img = $("<img>");
        $(this.el).append($img);
        this._Image = $img;
        this._Image.attr("src", this.noneImageSrc).height(this.height).width(this.width);
    },
    setUserid: function (userId) {
        this.userId = userId;
        if ($.trim(userId) != "")
            this._Image.attr("src", this.src + userId);
        else
            this._Image.attr("src", this.noneImageSrc);
    },
    setValue: function (value) {
        this.setUserid(value);
    },
    getValue: function () {
        return this.userId;
    },
    getAttrs: function (el) {
        var attrs = mini.ux.SignPic.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            [
                "userid", "width", "height"]
        );
        return attrs;
    }
});

mini.regClass(mini.ux.SignPic, "signpic");

mini.ux.PortraitPic = function () {
    mini.ux.PortraitPic.superclass.constructor.call(this);
    this.initControls();
}

mini.extend(mini.ux.PortraitPic, mini.Control, {
    uiCls: "mini-portraitpic",
    width: 90,
    height: 120,
    userId: "",
    src: "/MvcConfig/Image/GetUserPic?UserId=",
    noneImageSrc: "/CommonWebResource/RelateResource/image/photo.jpg",
    initControls: function () {
        var $img = $("<img>");
        $(this.el).append($img);
        this._Image = $img;
        this._Image.attr("src", this.noneImageSrc).height(this.height).width(this.width);
    },
    setUserid: function (userId) {
        this.userId = userId;
        if ($.trim(userId) != "")
            this._Image.attr("src", this.src + userId);
        else
            this._Image.attr("src", this.noneImageSrc);
    },
    setValue: function (value) {
        this.setUserid(value);
    },
    getValue: function () {
        return this.userId;
    },
    getAttrs: function (el) {
        var attrs = mini.ux.PortraitPic.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            [
                "userid", "width", "height"]
        );
        return attrs;
    }
});

mini.regClass(mini.ux.PortraitPic, "portraitpic");

/*----------pic控件------------------*/
mini.ux.Pic = function () {
    mini.ux.Pic.superclass.constructor.call(this);
    this.initControls();
}

mini.extend(mini.ux.Pic, mini.Control, {
    uiCls: "mini-pic",
    imageWidth: "",
    imageHeight: "",
    src: "",
    noneImageSrc: "",
    initControls: function () {
        var $img = $("<img>");
        $(this.el).append($img);
        this._Image = $img;
    },
    setNoneImageSrc: function (noneImageSrc) {
        this.noneImageSrc = noneImageSrc;
        this._Image.error(function (e) {
            var ele = e.srcElement;
            if (ele.parentElement && ele.parentElement.id) {
                var miniEle = mini.get(ele.parentElement.id);
                if (miniEle.noneImageSrc != undefined && miniEle.noneImageSrc != "" && miniEle.noneImageSrc != null)
                    miniEle.setSrc(miniEle.noneImageSrc);
            }
        });
    },
    setSrc: function (src) {
        this.src = src;
        if (src != undefined && src != "" && src != null)
            this._Image.attr("src", src);
        else
            this._Image.attr("src", this.noneImageSrc);
    },
    getSrc: function () {
        return this.src;
    },
    setImageWidth: function (value) {
        this.imageWidth = value;
        this._Image.width(value);
    },
    setImageHeight: function (value) {
        this.imageHeight = value;
        this._Image.height(value);
    },
    getAttrs: function (el) {
        var attrs = mini.ux.Pic.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            [
                "noneImageSrc", "src", "imageWidth", "imageHeight"]
        );
        return attrs;
    }
});

mini.regClass(mini.ux.Pic, "pic");

/*-----------userselect ----------------------------*/
var USERSELECT_GRIDURL_TMPL = "/MvcConfig/Auth/User/SelectUsers?OrgIDs={OrgIDs}&RoleIDs={RoleIDs}&Aptitude={Aptitude}";
function addAutoUserSelect(name, selectorParamSettings) {
    var $btn = jQuery("input[name='" + name + "']");
    if ($btn) {
        $btn.attr("id", name);
        $btn.each(function (index) { $(this).attr("onfocus", "onUserSelectFocus"); });
        $btn.each(function (index) { $(this).attr("onkeydown", "onUserSelectKeyDown"); });
        $btn.each(function (index) { $(this).attr("onkeyup", "onUserSelectKeyUp"); });
        $btn.each(function (index) { $(this).attr("onblur", "onUserSelectBlur"); });
        $btn.addClass("userselectbox");
        $btn.find("input").bind("dragenter", function () { return false });
        if (mini.get(name + "_grid") == null) {
            var userGrid = new mini.DataGrid();
            userGrid.set(
                $.extend({
                    id: name + "_grid",
                    width: 300,
                    height: 368,
                    style: "position:absolute;z-index:9999;",
                    borderStyle: "border-bottom:1px solid #999999;",
                    showPager: false,
                    visible: false,
                    pageSize: 10,
                    url: "",
                    onrowclick: onUserGridRowClick,
                    columns:
                        [{ field: "Name", headerAlign: "center", width: 60, header: "姓名" },
                        { field: "WorkNo", headerAlign: "center", width: 60, header: "工号" },
                        { field: "DeptName", headerAlign: "center", header: "所属部门" }]
                }, selectorParamSettings.gridParamSettings)
            );
            userGrid.render(document.body);
        }

    }
}

function showUserGrid(e) {
    var userSelect = e.sender;
    var userGrid = getUserGrid(e);
    var $userSelect = $(userSelect.getEl());
    var $grid = $(userGrid.getEl());
    var left = $userSelect.offset().left - (userGrid.getWidth() - userSelect.getWidth());
    if (($userSelect.offset().left + userGrid.getWidth()) <= $(window).width()
        || left <= 0) {
        left = $userSelect.offset().left;
    }
    $grid.css("left", left);
    $grid.css("top", $userSelect.offset().top + userSelect.getHeight());
    userGrid.show();
}

function onUserSelectFocus(e) {
    var settings = getSettings(selectorSettingss, e.sender.name);

    //如果grid为url为空则设url
    var grid = getUserGrid(e);
    //if ($.trim(grid.url) == "") {  去掉判断以适应增加动态修订参数的支持，使用SetSelectorURL()方法
    grid.setUrl(USERSELECT_GRIDURL_TMPL.replace("{OrgIDs}", $.trim(settings.OrgIDs)).replace("{RoleIDs}", $.trim(settings.RoleIDs)).replace("{Aptitude}", $.trim(JSON.stringify(settings.Aptitude))));
    //}

    settings.selector = e.sender;
    var txt = e.sender.getText();
    if ($.trim(txt) != "" && settings.selectMode == "multi" && txt.charAt(txt.length - 1) != ",") {
        txt = txt + ",";
        e.sender.setText(txt);
        movePosition($(e.sender.getEl()).find("input")[0], txt.length);
    }
    userKeyUpValue = "";
    userKeyUpText = "";
}

var userKeyDownText = ""; //保存键按下的值
var userKeyUpValue = ""; //保存键抬起的值
var userKeyUpText = "";  //保存键抬起的文本
function onUserSelectKeyDown(e) {
    if (e.sender.allowInput && e.sender.enabled && !(e.sender.readOnly)) {
        var userGrid = getUserGrid(e);
        var event = e.htmlEvent;
        var txt = e.sender.getText();

        userKeyDownText = txt;
        switch (event.keyCode) {
            case 38: //up
            case 40: //down
                if (userGrid.visible && userGrid.data.length > 0) {
                    var sel = userGrid.getSelected();
                    if (sel) {
                        var rowIndex = userGrid.indexOf(sel);
                        if (event.keyCode == 38) {
                            if (rowIndex > 0) {
                                rowIndex--;
                                userGrid.deselect(sel);
                                userGrid.select(userGrid.getRow(rowIndex));
                            }
                        }
                        else if (event.keyCode == 40) {
                            if (rowIndex < userGrid.data.length - 1) {
                                rowIndex++;
                                userGrid.deselect(sel);
                                userGrid.select(userGrid.getRow(rowIndex));
                            }
                        }
                    }
                    else {
                        userGrid.select(userGrid.getRow(0));
                    }
                }
                break;

            case 32: 	//space
                break;
            case 13: //enter
            case 9: //tab
                if (userGrid.visible) {
                    var sel = userGrid.getSelected();
                    if (!sel && userGrid.data.length > 0) {
                        sel = userGrid.data[0];
                    }
                    if (sel) {
                        //赋值
                        addUser(e.sender, sel);
                        appendDOUHAO(e);
                    }
                    userGrid.hide();
                }
                break;
            case 13:    //enter
            case 27:    //escr            
            case 35: 	//end
            case 36: 	//home
            case 37: 	//left
                break;
            case 39:    //right
                break;
            case 8: 	//backspace    
                var pos = getPosition($(e.sender.getEl()).find("input")[0]);
                if (pos > 0 && txt.charAt(pos - 1) == ",") {
                    txt = txt.substr(0, pos - 1) + txt.substr(pos);
                    e.sender.setText(txt);
                }
                else if (txt.indexOf(',') < 0) {//by Eric.Yang 即使是空值，也依然向控件赋值，避免人员选择控件在输入删除键后会造成人员姓名与ID不匹配的BUG 2018.8.15
                    txt = ""; e.sender.setText(txt);
                }
                if (txt.length < 2) {
                    $("#" + e.sender.id + "_grid").hide();
                }
                break;
            case 46: //delete
                break;
            default:

        }
    }
}

function onUserSelectKeyUp(e) {
    if (e.sender.allowInput && e.sender.enabled && !(e.sender.readOnly)) {
        var userGrid = getUserGrid(e);
        var txt = e.sender.getText();
        var event = e.htmlEvent;

        switch (event.keyCode) {
            case 27: //escr
            case 8:  //backspace
            case 46: //delete       
                updateSelectUser(e);
                appendDOUHAO(e);
                break;
            case 37: //left
            case 38: //up
            case 39: //right
            case 40: //down
                break;
            case 13: //enter
            case 9: //tab
                break;
            default:
                txt = txt.replace("，", ",");
                if (txt.trim() == "")//修订有问题：微软输入法会产生结果一致的情况，故只判断空文本一致忽略
                    break;

                e.sender.setText(txt);

                userKeyUpValue = e.sender.getValue();
                userKeyUpText = txt;

                var settings = getSettings(selectorSettingss, e.sender.name)
                var userSelectData = getSelectedUsers(settings, e.sender);
                txt = txt.replace(getUserNameArray(userSelectData).join(',') + ",", "");
                var userid = getUserIDArray(userSelectData).join(',');
                userGrid.load({
                    key: txt,
                    value: userid
                }, function (data) {
                    if (userGrid.data.length > 0) {
                        if (userGrid.data.length == 1) {
                            //赋值
                            addUser(e.sender, userGrid.data[0]);
                            if (userGrid.visible)
                                userGrid.hide();
                            appendDOUHAO(e);
                        }
                        else {
                            showUserGrid(e);
                        }
                    }
                    else {
                        if (userGrid.visible)
                            userGrid.hide();
                    }
                });
        }
    }
}

function onUserSelectBlur(e) {
    
    if (!(e.sender.enabled) || e.sender.readOnly) { return; }

    var settings = getSettings(selectorSettingss, e.sender.name);
    if (settings.targetType == "form" || settings.targetType == "row") {
        //1.更新选人
        updateSelectUser(e);
        if (settings.targetType == "form"  && (!settings.data || settings.data.length == 0)) {
            e.sender.setText("");
            e.sender.setValue("");
        }
        else if (settings.targetType == "row" ){
            var grid = mini.get(settings.gridId);
            var row = grid.getEditorOwnerRow(e.sender);

            if (!settings.data || !settings.data[row["_uid"]] || settings.data[row["_uid"]].length == 0) {
                e.sender.setText("");
                e.sender.setValue("");
            }
        }
        //焦点不在grid上则隐藏grid
        setTimeout(function () {
            var userGrid = getUserGrid(e);
            userGrid.hide();

        }, 200);
    }
    else {

    }
}

function onUserGridRowClick(e) {
    var rec = e.record;
    var userSelectName = e.sender.id.replace("_grid", "");
    var userSelect = mini.get(userSelectName);
    if (!userSelect)
        userSelect = mini.getbyName(userSelectName);

    var settings = getSettings(selectorSettingss, userSelectName);
    if (settings.targetType == "form") {
        if (!settings.data || settings.data.length == 0)
        {
            userSelect.setValue("");
            userSelect.setText("");
        }
    } else if (settings.targetType == "row") {
        var grid = mini.get(settings.gridId);
        var row = grid.getEditorOwnerRow(userSelect);
        if (!settings.data[row["_uid"]] || settings.data[row["_uid"]].length == 0) {
            userSelect.setValue("");
            userSelect.setText("");
        }
    } else {
        userSelect.setValue(userKeyUpValue);
        userSelect.setText(userKeyUpText);
    }
    addUser(userSelect, rec);
    e.sender.hide();
}

function getUserGrid(e) {
    var grid = mini.get(e.sender.name + "_grid");
    return grid;
}

function updateSelectUser(e) {
    var txt = e.sender.getText();

    if (txt == "" || txt == ",") {
        clearSelectUser(e.sender);
        return;
    }
    var settings = getSettings(selectorSettingss, e.sender.name);
    settings.selectorId = e.sender.id;
    var data = getSelectedUsers(settings, e.sender);

    if (txt.charAt(txt.length - 1) == ",")
        txt = txt.substr(0, txt.length - 1);

    if (getValues(data, "Name") == txt) {
        e.sender.setText(txt);
        return;
    }

    var selRows = [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if ((txt+",").indexOf(item["Name"]+",") >= 0)
            selRows.push(item);
    }
    if (selRows.length >= 0) //by Eric.Yang 即使是空值，也依然向控件赋值，避免人员选择控件在输入删除键后会造成人员姓名与ID不匹配的BUG 2018.8.15
        settings.onSelected(selRows, settings);
}
//附加逗号
function appendDOUHAO(e) {
    //追加逗号    
    var txt = e.sender.getText();
    if (txt == "" || txt == ",")
        return;
    if (txt.charAt(txt.length - 1) == ",")
        return;
    var settings = getSettings(selectorSettingss, e.sender.name);
    if (settings.selectMode == "multi") {
        e.sender.setText(txt + ",");
    }
}

function clearSelectUser(miniCtrl) {
    var settings = getSettings(selectorSettingss, miniCtrl.name);
    settings.selectorId = miniCtrl.name;
    settings.onSelected([], settings);
}
function addUser(miniCtrl, userInfo) {
    var userid = userInfo.ID;
    var settings = getSettings(selectorSettingss, miniCtrl.name);
    var userSelectData = [];
    var selectMode = settings.selectMode;
    var selectedUserList = getSelectedUsers(settings, miniCtrl);

    if (selectMode == "multi" && selectedUserList.length > 0) {
        var arr = miniCtrl.getText().split(',');
        for (var i = 0; i < arr.length; i++) {
            if (selectedUserList[i] && arr[i] == selectedUserList[i]["Name"])
                userSelectData.push(selectedUserList[i]);
        }
    }
    if ((getUserIDArray(userSelectData).join(',') + ",").indexOf(userid + ",") == -1)
        userSelectData.push(userInfo);
    settings.selectorId = miniCtrl.name;
    settings.onSelected(userSelectData, settings);
}

function getUserIDArray(userData) {
    var val = [];
    if (typeof (userData) != "undefined") {
        $.each(userData, function (i, user) {
            if ($.trim(user.ID) != "") {
                val.push(user.ID);
            }
        });
    }
    return val;
}

function getUserNameArray(userData) {
    var val = [];
    if (typeof (userData) != "undefined") {
        $.each(userData, function (i, user) {
            if ($.trim(user.Name) != "") {
                val.push(user.Name);
            }
        });
    }
    return val;
}

//单行文本框
function getPosition(ctrl) {
    var CaretPos = 0;
    if (document.selection) { // IE Support 
        ctrl.focus();
        var Sel = document.selection.createRange();
        Sel.moveStart('character', -ctrl.value.length);
        CaretPos = Sel.text.length;
    } else if (ctrl.selectionStart || ctrl.selectionStart == '0') {// Firefox support 
        CaretPos = ctrl.selectionStart;
    }
    return (CaretPos);
}

function movePosition(obj, len) {
    obj.focus();
    if (document.selection) {
        var sel = obj.createTextRange();
        sel.moveStart('character', len);
        sel.collapse();
        sel.select();
    } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
        obj.selectionStart = obj.selectionEnd = len;
    }
}

function getSelectedUsers(settings, selector) {
    if (settings.targetType == "form") {
        if (!settings.data || settings.data.length == 0) {
            settings.data = getSelectedUsersFromForm(settings, selector);
        }
        return settings.data;
    }
    else if (settings.targetType == "row") {
        var grid = mini.get(settings.gridId);
        var row = grid.getEditorOwnerRow(selector);
        if (!settings.data)
            settings.data = {};
        if (!settings.data[row["_uid"]] || settings.data[row["_uid"]].length == 0)
            settings.data[row["_uid"]] = getSelectedUsersFromRow(settings, selector);
        return settings.data[row["_uid"]];
    }
    else {
        return [];
    }
}

function getSelectedUsersFromForm(settings, editor) {
    var value = editor.getValue();
    var text = editor.getText();
    if (value == "" || value==text)
        return [];
    
    if (userKeyDownText == "")
        userKeyDownText = text;
    var arrValues = value.split(',');
    var arrNames = text.split(',');
    var result = [];
    for (var i = 0; i < arrValues.length; i++) {
        result.push({ ID: arrValues[i], Name: arrNames[i] });
    }

    var arrReturnParams = settings.returnParams.split(',');
    for (var x = 2; x < arrReturnParams.length; x++) {
        if (arrReturnParams[x] == "") break;
        var v1 = arrReturnParams[x].split(':')[0];
        var v2 = arrReturnParams[x].split(':')[1];

        if (v1 == "value" || v1 == "text") continue;

        var v = mini.getbyName(v1).getValue();
        if (v === undefined) v = "";

        var arrRelateValues = v.toString().split(',');
        for (var i = 0; i < result.length; i++) {
            result[i][v2] = arrRelateValues[i];
        }
    }
    return result;
}

function getSelectedUsersFromRow(settings, selector) {
    if (selector.getValue() == "")
        return [];

    var grid = mini.get(settings.gridId);
    var row = grid.getEditorOwnerRow(selector);

    var arrReturnParam = settings.returnParams.split(',');

    var result = [];

    var values = selector.getValue().split(',');
    var texts = selector.getText().split(',');

    for (var i = 0; i < values.length; i++) {
        var obj = {};

        for (var j = 0; j < arrReturnParam.length; j++) {
            if (arrReturnParam[j] == "")
                continue;
            var key = arrReturnParam[j].split(':')[0];

            if (key == "value") {
                obj.ID = values[i];
            }
            else if (key == "text") {
                obj.Name = texts[i];
                //obj.Name = userKeyDownText.split(',')[i]; 
            }
            else if (row[key]) {
                if (row[key].split)
                    obj[key] = row[key].split(',')[i];
                else
                    obj[key] = row[key];

            }
            else {
                obj[key] = "";
            }
        }
        result.push(obj);
    }
    return result;
}

//--------------------------------mini-word控件 从mini.Control继承------------------------------------------
mini.ux.Word = function () {
    mini.ux.Word.superclass.constructor.call(this);
    this.initControls();
    this.initEvents();
}

mini.extend(mini.ux.Word, mini.Control, {
    formField: true,
    module: document.location.pathname.split('/')[1],
    desc: "Word",
    grid_id: "",
    required: false, //是否必填
    readonly: false, //是否只读
    disabled: false, //是否禁用
    revise: false,
    uiCls: "mini-word",

    initControls: function () {
        mini.parse(this.el);
        var attrs = mini.ux.Word.superclass.getAttrs.call(this, this.el);
        var $border = $("<span>").addClass("mini-word-border");
        var $a = $("<a></a>").attr("href", "javascript:void(0);").text(this.desc);
        var $spanLink = $("<span></span>").css({ "padding": "1px", "vertical-align": "middle" }).append($a);
        var $spanDel = $("<span>").addClass("mini-singlefile-remove").attr("title", "删除").hide();
        $(this.el).append($border.append($spanLink).append($spanDel)).append($("<input>").attr("type", "hidden"));
        this._border = $border;
        this._aLink = $a;
        this._btnDelete = $(this.el).find(".mini-singlefile-remove");
        this._hidDocID = $(this.el).find("input[type='hidden']");
    },
    initEvents: function () {
        var _self = this;
        this._aLink.bind("click", function (event) {
            var url = _self.getUrl(_self.grid_id);
            openWindow(url, {
                title: "在线Office协同办公组件",
                width: "90%",
                height: "90%"
            });
        });
        this._btnDelete.bind("click", function (event) {
            _self.removeValue();
        });

        //监听grid,treegrid的cellbeginedit
        $.each($(".mini-grid,mini-treegrid"), function (i, grid) {
            mini.get(grid.id).on("cellbeginedit", function (e) {
                _self.grid_id = e.sender.id;
            });
        });
        mini.on(this._hidDocID[0], "propertychange", this.__OnChange, this);
    },
    setDesc: function (desc) {
        this.desc = desc;
        this._aLink.text(this.desc);
    },
    getValue: function () {
        return this._hidDocID.val();
    },
    setValue: function (docID) {
        this._hidDocID.val(docID);
        this.setStatusStyle();
    },
    validate: function () {
        var isVal = this.isValid();
        var errorId = this.id + "-errorIcon";
        if (!isVal) {
            if ($("#" + errorId).length == 0) {
                //添加error图标
                var $imgError = $("<span>").attr("id", errorId).addClass("mini-word-error").attr("title", "不能为空");
                $(this._border).append($imgError);
            }
            return false;
        }
        else {
            $("#" + errorId).remove();
            return true;
        }
    },
    isValid: function () {
        if (this.required) {
            if (this.getValue() != "") {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
    },
    setReadOnly: function (readonly) {
        if (readonly) {
            this.readonly = true;
        }
        else {
            this.readonly = false;
        }
        this.setStatusStyle();
    },
    setDisabled: function (disabled) {
        if (disabled) {
            this.disabled = true;
        }
        else {
            this.disabled = false;
        }
        this.setStatusStyle();
    },
    setRequired: function (required) {
        if (required) {
            this.required = true;
        }
        else {
            this.required = false;
        }
    },
    setRevise: function (revise) {
        this.revise = revise || revise == "true";
    },
    setStatusStyle: function () {
        if (this.readonly || this.disabled) {
            this._btnDelete.hide();
            if (this._hidDocID.val() != "") {
                this._border.show();
            }
            else {
                this._border.hide();
            }
        }
        else {
            this._border.show();
            if (this._hidDocID.val() != "")
                this._btnDelete.show();
            else
                this._btnDelete.hide();
        }
    },
    setCallback: function (callBack) {
        this.callback = callBack;
    },
    getUrl: function (gridId) {
        var url = "/" + this.module + "/WebOffice.axd?mini_ctrl=" + this.id + "&callback=wordSaveCallBack";
        if ($.trim(this._hidDocID.val()) != "")
            url += "&DocID=" + $.trim(this._hidDocID.val());
        if (this.readonly || this.disabled) {
            url += "&readonly=True";
        }
        if (this.revise) {
            url += "&revise=True";
        }
        if ($.trim(gridId) != "") {
            url += "&grid_id=" + gridId;
        }
        return url;
    },
    removeValue: function () {
        if ($.trim(this._hidDocID.val()) != "") {
            var _self = this;
            var _val = _self.getValue();
            msgUI("确认要删除文件吗？", 2,
                function (action) {
                    if (action == "ok") {
                        _self.setValue("");
                        if (_self.grid_id != "") {
                            wordSaveUpdateGrid(_self.grid_id, "");
                        }
                    }
                }
            );
        }
    },
    setModule: function (module) {
        this.module = module;
    },
    getAttrs: function (el) {
        var attrs = mini.ux.Word.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            [
                "required", "readonly", "disabled", "desc", "revise", "module", "onchange"]
        );
        return attrs;
    },
    __OnChange: function (e) {
        var t = mini.findParent(e.target, "mini-word");
        if (t) {
            var val = this.getValue();
            var ev = {
                sender: this,
                value: val
            };
            this.fire("change", ev);
        }
    }

});

function wordSaveCallBack(docid, minid, gridid) {
    if (mini.get(minid)) {
        mini.get(minid).setValue(docid);
        mini.get(minid).validate();
    }
    if (mini.get(gridid)) {
        wordSaveUpdateGrid(gridid, docid);
    }
}

function wordSaveUpdateGrid(gridid, docid) {
    var grid = mini.get(gridid);
    if (grid) {
        var cell = grid.getCurrentCell();
        if (cell) {
            var field = cell[1]["field"];
            var row = grid.getRow(cell[0]["_id"] - 1);
            var newData = eval("({ " + field + ": '" + docid + "'})");
            grid.updateRow(row, newData);
        }
    }
}

mini.regClass(mini.ux.Word, "word");


//--------------------------------mini-pinyincomplete控件 从mini.autocomplete继承------------------------------------------
mini.ux.PinYinComplete = function () {
    mini.ux.PinYinComplete.superclass.constructor.call(this);
    this.initControls();
}

mini.extend(mini.ux.PinYinComplete, mini.AutoComplete, {
    formField: true,
    enumCode: "",
    valueFromSelect: true,
    disabled: false,
    uiCls: "mini-pinyincomplete",
    initControls: function () {
        this.setValueField("value");
        this.setTextField("text");
    },
    setEnumCode: function (enumCode) {
        this.enumCode = enumCode;
        this.url = "/Base/Meta/Enum/GetItemListByPinYin?EnumCode=" + enumCode;
    },
    setDisabled: function (disabled) {
        if (disabled) {
            this.disabled = true;
            this.disable();
        }
        else {
            this.disabled = false;
            this.enable();
        }
    },
    getAttrs: function (el) {
        var attrs = mini.ux.PinYinComplete.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            [
                "required", "readonly", "disabled", "enumCode"]
        );
        return attrs;
    }
});

mini.regClass(mini.ux.PinYinComplete, "pinyincomplete");


//*****************************************URL选择控件Start**********************************//

mini.ux.LinkEdit = function () {
    mini.ux.LinkEdit.superclass.constructor.call(this);
    this.bindEvents();
}

mini.extend(mini.ux.LinkEdit, mini.Textbox, {
    uiCls: 'mini-linkedit',
    name: "",
    formField: true,
    text: "请选择",
    value: "",
    _create: function () {
        this.el = document.createElement("span");
        this.el.className = "";

        //        if (this.value.indexOf(',') > 0) {
        //        }
        //        else {
        //            this.el.innerHTML = '<a href="#">' + this.text + '</a>&nbsp;<span style="cursor:pointer;">...</span>';
        //        }

        var arrValue = this.value.split(',');
        var arrText = this.text.split(',');
        var bodyHtml = "";
        $.each(arrValue, function (i, val) {
            if ($.trim(val) != "") {
                var txt = arrText[i];
                bodyHtml += '<a href="#" onclick="openWindow(\'' + val + '\', { addQueryString: false })">' + txt + '</a><br/>';
            }
        });
        if (bodyHtml.length > 5) {
            bodyHtml = bodyHtml.substr(0, bodyHtml.length - 5);
        }
        bodyHtml += '&nbsp;<span style="cursor:pointer;">...</span>';

        this.el.innerHTML = bodyHtml;

        //this._linkEl = this.el.firstChild;
        this._buttonEl = this.el.lastChild;
    },
    bindEvents: function () {
        mini.on(this._buttonEl, "click", this.__OnClick, this);
        //mini.on(this._linkEl, "click", this.__OnLink, this);
    },
    __OnClick: function (htmlEvent) {
        var e = {
            sender: this,
            htmlEvent: htmlEvent
        };
        this.fire("buttonclick", e); //调用标签的onbuttonclick事件
    },
    __OnLink: function (htmlEvent) {
        var e = {
            sender: this,
            htmlEvent: htmlEvent
        };

        if (!this.readonly && !this.value) {
            this._buttonEl.click(e);
        }
        else {
            //openWindow(this.value, { addQueryString: false });
        }
    },
    setText: function (val) {
        if (!val)
            val = "请选择";

        this.text = val;

        var arrValue = this.value.split(',');
        var arrText = this.text.split(',');
        var bodyHtml = "";
        $.each(arrValue, function (i, val) {
            if ($.trim(val) != "") {
                var txt = arrText[i];
                bodyHtml += '<a href="#" onclick="openWindow(\'' + val + '\', { addQueryString: false })">' + txt + '</a><br/>';
            }
        });
        if (bodyHtml.length > 5) {
            bodyHtml = bodyHtml.substr(0, bodyHtml.length - 5);
        }
        bodyHtml += '&nbsp;<span style="cursor:pointer;">...</span>';

        this.el.innerHTML = bodyHtml;

        this._buttonEl = this.el.lastChild;

        mini.on(this._buttonEl, "click", this.__OnClick, this);
    },
    getText: function () {
        return this.text;
    },
    setValue: function (val) {
        this.value = val;

    },
    getValue: function () {
        return this.value;
    },
    setReadonly: function (val) {
        this.readonly = val;
        if (val)
            $(this._buttonEl).show();
        else
            $(this._buttonEl).hide();
    },
    getAttrs: function (el) {
        var attrs = mini.ux.LinkEdit.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs,
            ["text", "onclick", "onbuttonclick", "textName", "required"]
        );
        mini._ParseBool(el, attrs,
            ["readonly"]
        );
        return attrs;
    }
});

mini.regClass(mini.ux.LinkEdit, "linkedit");


//*****************************************URL选择控件End**********************************//



/*****************************************H5上传方法封装******************************************/

function addH5Upload(normalSettings) {
    var defaultSettings = {
        ID: "h5Upload",       //上传控件ID            
        title: "上传附件",  //显示名称
        fileType: "*",      //上传文件的类型
        url: UploadUrl, //上传的地址
        buttonClass: "uploadify-button", //按钮样式
        isMulti: false,  //是否多选
        width: 120, //宽度
        height: 25, //高度
        isPass: true, //是否通过认证
        closeWindow: false,  //执行成功后是否关闭窗口
        onBefore: null,  //执行前方法 返回true与false,true为通过
        onComplete: null,  //回调方法
        onParams: null  //获取参数的方法
    };
    loadUploadifyResource();

    var settings = $.extend(true, {}, defaultSettings, normalSettings);
    $("#" + settings.ID).uploadifive({
        'multi': settings.isMulti,
        'auto': true,
        'checkScript': '',
        'formData': {},
        'queueID': settings.ID,
        uploadScript: settings.url,
        buttonClass: settings.buttonClass,
        buttonText: settings.title,
        width: settings.width,
        height: settings.height,
        fileType: settings.fileType,
        onFallback: function () {
            alert("该浏览器无法使用H5 上传控件，请确认是否是IE10 及 以上版本!");
        },
        onUploadComplete: function (file, data, response) {
            if (!settings.isMulti && settings.isPass) {
                msgUI("上传成功" + "！");
            }
            if (settings.onComplete)
                settings.onComplete(data, settings);
            if (settings.closeWindow)
                closeWindow("refresh");
        },
        onUpload: function () {
            if (settings.fileType != "" && settings.fileType.indexOf('*') <= 0) {
                var isTrue = false;
                var arr = settings.fileType.split(',');
                for (var i = 0; i < arr.length; i++) {
                    var suffix = arr[i].split('/').length > 1 ? arr[i].split('/')[1] : arr[i].split('/')[0];
                    if (file.name.indexOf('.' + suffix) >= 0) {
                        isTrue = true;
                    }
                }
                if (!isTrue) {
                    this.stop();
                    settings.isPass = false;
                    msgUI("只能上传类型为：" + settings.fileType + "的文件!");
                    return;
                }
            }

            if (settings.onBefore) {
                var isTrue = eval(settings.onBefore);
                if (!isTrue) {
                    this.stop();
                    settings.isPass = false;
                }
            }

            if (settings.onParams) {
                var params = eval(settings.onParams);
                if (params)
                    $('#' + settings.ID).data('uploadifive').settings.formData = params;
            }
        },
        onSelect: function (file) {

        }
    });

}

/*****************************************H5上传方法封装  结束************************************/


//*子表上传附件方法*//
//uploadifive子表附件上传
function btnUploadifiveClick(e) {
    var fileUploadButtonEdit = null;
    var fileUploadSetttings = {};
    fileUploadButtonEdit = e.sender;
    fileUploadSetttings = mini.decode(fileUploadButtonEdit.label);

    $("#btnUploadifive").uploadifive({
        'multi': false,
        'auto': true,
        'checkScript': '',
        'formData': {},
        'queueID': "btnUploadifive",
        uploadScript: UploadUrl,
        fileSizeLimit: fileSizeLimit,
        buttonClass: "",
        buttonText: '单附件上传',
        width: 120,
        height: 25,
        fileType: fileUploadSetttings.fileType,
        formData: fileUploadSetttings,
        onFallback: function () {
            alert("该浏览器无法使用H5 上传控件，请确认是否是IE10 及 以上版本!");
        },
        onUploadComplete: function (file, data, response) {
            //alert("onUploadComplete");
            fileUploadButtonEdit.setText(file.name);
            fileUploadButtonEdit.setValue(data);
            $(".uploadifive-queue-item.complete").hide();
            if (this[0].loadingMessageId) {
                try {
                    mini.hideMessageBox(this[0].loadingMessageId);
                } catch (e) { }
            }
        },
        onUpload: function (filesToUpload) {
            if (filesToUpload > 0) {
                this[0].loadingMessageId = mini.loading("文件上传中...", "上传中", { width: 300 });
            }
        },
        onError: function (errorType, file) {
            var msg = "上传错误，FileStore配置出错！";
            switch (errorType) {
                case 'UPLOAD_LIMIT_EXCEEDED':
                    msg = "上传的文件数量已经超出系统限制！";
                    break;
                case 'FILE_SIZE_LIMIT_EXCEEDED':
                    msg = "文件 [" + file.name + "] 大小超出系统限制尺寸：" + fileSizeLimit;
                    break;
                case 'QUEUE_LIMIT_EXCEEDED':
                    msg = "任务数量超出队列限制！";
                    break;
                case 'FORBIDDEN_FILE_TYPE':
                    msg = "文件 [" + file.name + "] 类型不正确！";
                    break;
                case '404_FILE_NOT_FOUND':
                    msg = "文件未上传成功，请联系管理员！";
                    break;
            }
            msgUI(msg);
            if (this[0].loadingMessageId) {
                try {
                    mini.hideMessageBox(this[0].loadingMessageId);
                } catch (e) {

                }
            }
        },
        onSelect: function (file) {
            //alert("onSelect");
        }
    });

    $('#btnUploadifive').parent().find('>input:last').click();
}

//**********************子表上传附件方法结束*****************************//