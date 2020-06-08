

function initBusLeft(tasklist, domObj) {
    if (!tasklist) return; if (!domObj) return;
    var exeName = ""; var exeDate = ""; var scontent = ""; var ownerName = "";

    if (tasklist.length > 3) {
        var task = tasklist[0];
        scontent += PaintContent("&nbsp;首环节：" + task.Name, task.exeName, task.ownerName, task.BeginDate, task.EndDate, task.advice, "more");
        task = tasklist[tasklist.length - 2];
        scontent += PaintContent("&nbsp;上一环节：" + task.Name, task.exeName, task.ownerName, task.BeginDate, task.EndDate, task.advice, "down");
        task = tasklist[tasklist.length - 1];
        scontent += PaintContent("&nbsp;当前环节：" + task.Name, task.exeName, task.ownerName, task.BeginDate, task.EndDate, task.advice, "");
    }
    else if (tasklist.length == 3) {
        var task = tasklist[0];
        scontent += PaintContent("&nbsp;首环节：" + task.Name, task.exeName, task.ownerName, task.BeginDate, task.EndDate, task.advice, "down");
        task = tasklist[tasklist.length - 2];
        scontent += PaintContent("&nbsp;上一环节：" + task.Name, task.exeName, task.ownerName, task.BeginDate, task.EndDate, task.advice, "down");
        task = tasklist[tasklist.length - 1];
        scontent += PaintContent("&nbsp;当前环节：" + task.Name, task.exeName, task.ownerName, task.BeginDate, task.EndDate, task.advice, "");
    } else if (tasklist.length == 2) {
        var task = tasklist[0];
        scontent += PaintContent("&nbsp;首环节：" + task.Name, task.exeName, task.ownerName, task.BeginDate, task.EndDate, task.advice, "down");
        task = tasklist[1];
        scontent += PaintContent("&nbsp;当前环节：" + task.Name, task.exeName, task.ownerName, task.BeginDate, task.EndDate, task.advice, "");
    }

    domObj.innerHTML = scontent;
}

function PaintContent(name, execName, ownerName, startTime, endTime, advice, iconType) {
    var delegateInfo = "";
    if (ownerName != undefined && ownerName != "")
        delegateInfo = "&nbsp;|&nbsp;操作人：" + ownerName;
    if (endTime == null) endTime = "";
    var content = "";

    if (iconType == "")
        content += '<table width="100%" cellspacing="0" cellpadding="0" STYLE="border-style:groove;border-width:2pt; border-color: blue">';
    else
        content += '<table width="100%" cellspacing="0" cellpadding="0">';
    content += '  <tr>'
    content += '    <td><table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;">'
    content += '      <tr>'
    content += '        <td width="10" height="9"><img src="/CommonWebResource/Theme/Default/Workflow/images/gwlctable_titletoplift2.gif" width="10" height="9"></td>'
    content += '        <td  style="background-image:url(/CommonWebResource/Theme/Default/Workflow/images/gwlctable_titletopbg2.gif);"></td>'
    content += '        <td width="11"><img src="/CommonWebResource/Theme/Default/Workflow/images/gwlctable_titletopright2.gif" width="11" height="9"></td>'
    content += '      </tr>'
    content += '    </table>'
    content += '        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;">'
    content += '          <tr>'
    content += '            <td width="10" background="/CommonWebResource/Theme/Default/Workflow/images/gwlctable_titlemiddleleft2.gif"></td>'
    content += '            <td  align="left" valign="middle" style="background-image:url(/CommonWebResource/Theme/Default/Workflow/images/gwlctable_titlemiddlebg2.gif); background-position:top; background-repeat:repeat-x; background-color:#f6e8cf; line-height:18px;" >' + name + '</td>'
    content += '            <td width="9" background="/CommonWebResource/Theme/Default/Workflow/images/gwlctable_titlemiddleright2.gif"></td>'
    content += '          </tr>'
    content += '        </table>'
    content += '      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;">'
    content += '          <tr>'
    content += '            <td width="10" height="11"><img src="/CommonWebResource/Theme/Default/Workflow/images/gwlctable_titlebottomleft2.gif" width="10" height="11"></td>'
    content += '            <td  style="background-image:url(/CommonWebResource/Theme/Default/Workflow/images/gwlctable_titlebottombg2.gif);"></td>'
    content += '            <td width="11"><img src="/CommonWebResource/Theme/Default/Workflow/images/gwlctable_titlebottomright2.gif" width="11" height="11"></td>'
    content += '          </tr>'
    content += '        </table>'
    content += '      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;">'
    content += '          <tr>'
    content += '            <td width="1"  style="background-color:#a9a9a9;" ></td>'
    content += '            <td valign="middle"  style="background-image:url(/CommonWebResource/Theme/Default/Workflow/images/gwlctable_namebg2.gif); background-position:top; background-repeat:repeat-x; background-color:#d9d9d9; line-height:22px;" class="f12 gray nl">&nbsp;<img src="/CommonWebResource/Theme/Default/Workflow/images/0001.gif" width="16" height="16">&nbsp;接收人：' + execName + delegateInfo + '</td>'
    content += '            <td width="1" style="background-color:#a9a9a9;" ></td>'
    content += '          </tr>'
    content += '        </table>'
    content += '      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="height:1px; width:100%; background-color:#a9a9a9;">'
    content += '          <tr>'
    content += '            <td></td>'
    content += '          </tr>'
    content += '        </table>'
    content += '      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;">'
    content += '          <tr>'
    content += '            <td width="1" style=" background-color:#a9a9a9;"></td>'
    content += '            <td><table width="100%" border="0" cellspacing="0" cellpadding="0" style="height:1px; width:100%; background-color:#ffffff;">'
    content += '                <tr>'
    content += '                  <td></td>'
    content += '                </tr>'
    content += '              </table>'
    content += '                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;">'
    content += '                  <tr>'
    content += '                    <td width="1" style=" background-color:#ffffff;"></td>'
    content += '                    <td style=" background-color:#f5f5f5; padding:2px;"><table width="100%" border="0" cellspacing="0" cellpadding="0">'
    content += '                        <tr>'
    content += '                          <td class="f12 gray nl">&nbsp;<img src="/CommonWebResource/Theme/Default/Workflow/images/0002.gif" width="16" height="16" >&nbsp;接收:' + startTime + '</td>'
    content += '                        </tr>'
    content += '                      </table>'
    content += '                        <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">'
    content += '                          <tr>'
    content += '                            <td height="1" bgcolor="#999999"></td>'
    content += '                          </tr>'
    content += '                        </table>'
    content += '                      <table width="100%" border="0" cellspacing="0" cellpadding="0">'
    content += '                          <tr>'
    content += '                            <td class="f12 gray nl">&nbsp;<img src="/CommonWebResource/Theme/Default/Workflow/images/0002.gif" width="16" height="16" >&nbsp;操作:' + endTime + '</td>'
    content += '                          </tr>'
    content += '                        </table>'
    content += '                      <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">'
    content += '                          <tr>'
    content += '                            <td height="1" bgcolor="#999999"></td>'
    content += '                          </tr>'
    content += '                        </table>'

    content += PaintAdviceContent(execName, advice);



    content += '                      <table width="90%" border="0" cellspacing="0" cellpadding="0">'
    content += '                          <tr>'
    content += '                            <td height="3"></td>'
    content += '                          </tr>'
    content += '                      </table>'
    content += '                      </td>'
    content += '                    <td width="1" style=" background-color:#ffffff;"></td>'
    content += '                  </tr>'
    content += '                </table>'
    content += '              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="height:1px; width:100%; background-color:#ffffff;">'
    content += '                  <tr>'
    content += '                    <td></td>'
    content += '                  </tr>'
    content += '              </table></td>'
    content += '            <td width="1" style=" background-color:#a9a9a9;"></td>'
    content += '          </tr>'
    content += '        </table>'
    content += '      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="height:1px; width:100%; background-color:#a9a9a9;">'
    content += '          <tr>'
    content += '            <td></td>'
    content += '          </tr>'
    content += '      </table></td>'
    content += '    <td width="5" valign="middle"><img src="/CommonWebResource/Theme/Default/Workflow/images/gwlctablearrow.gif" width="5" height="10" style="display:none;"></td>'
    content += '  </tr>'
    content += '</table>'


    if (iconType == "more") {

        content += '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
        content += '	<tr>'
        content += '		<td height="25" align="center" valign="bottom"><img src="/CommonWebResource/Theme/Default/Workflow/images/more.png" width="30" height="22"></td>'
        content += '	</tr>'
        content += '</table>'
    }
    else if (iconType == "down") {

        content += '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
        content += '	<tr>'
        content += '		<td height="25" align="center" valign="bottom"><img src="/CommonWebResource/Theme/Default/Workflow/images/down.png" width="30" height="22"></td>'
        content += '	</tr>'
        content += '</table>'

    }

    return content;
}


function PaintAdviceContent(execName, advice) {

    var shortAdvice = advice.length > 10 ? advice.substr(0, 13) : advice;
    
    var content = "";


    content += '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
    content += '	<tr>'
    content += '		<td style="word-wrap:break-word;word-break:break-all;" title="' + advice + '"><nobr>&nbsp;<img src="/CommonWebResource/Theme/Default/Workflow/images/0003.gif" width="16" height="16">&nbsp;' + shortAdvice + '</td>'
    content += '	</tr>'
    content += '</table>'


    content += '<table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">'
    content += '	<tr>'
    content += '		<td height="1" bgcolor="#999999"></td>'
    content += '	</tr>'
    content += '</table>'


    return content;
}