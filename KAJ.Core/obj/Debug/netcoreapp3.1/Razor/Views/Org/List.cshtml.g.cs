#pragma checksum "F:\0_Study\1_Core\KAJ.Core\Views\Org\List.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "12f95cced8dda77f3050bbdd04b80c5ee2b6e62a"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Org_List), @"mvc.1.0.view", @"/Views/Org/List.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "F:\0_Study\1_Core\KAJ.Core\Views\_ViewImports.cshtml"
using KAJ.Core;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "F:\0_Study\1_Core\KAJ.Core\Views\_ViewImports.cshtml"
using KAJ.Core.Models;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"12f95cced8dda77f3050bbdd04b80c5ee2b6e62a", @"/Views/Org/List.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"b183ca7a37c5b3a8c34c3cfe155ba8f395e45405", @"/Views/_ViewImports.cshtml")]
    public class Views_Org_List : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral("\r\n");
#nullable restore
#line 2 "F:\0_Study\1_Core\KAJ.Core\Views\Org\List.cshtml"
  
    ViewData["Title"] = "List";

#line default
#line hidden
#nullable disable
            WriteLiteral(@"<div class=""layui-btn-container"">
    <button type=""button"" class=""layui-btn"" onclick=""add()"">添加</button>
    <button type=""button"" class=""layui-btn"" onclick=""edit()"">编辑</button>
    <button type=""button"" class=""layui-btn"" onclick=""del()"">删除</button>
</div>
<table id=""demo"" lay-filter=""test""></table>
<script>
    layui.use('table', function () {
        var table = layui.table;
        layer.load();
        //第一个实例
        table.render({
            elem: '#demo'
            , cellMinWidth: 80
            , url: '/Org/GetList' //数据接口
            , page: true //开启分页
            , cols: [[ //表头
                { type: 'checkbox', width: '5%' }
                , { type: 'numbers', title: '序号', align: 'center', width: '5%' }
                , { field: 'ID', title: 'ID', align: 'center',width: '20%' }
                , { field: 'Code', title: '编号', align: 'left',width: '20%' }
                , { field: 'Name', title: '名称', align: 'center',width: '20%' }
                , { field: 'CreateTime");
            WriteLiteral(@"', title: '创建时间', align: 'center',width: '10%' }
                , { field: 'Remark', title: '备注', width: '20%' }
            ]]
        });
        layer.closeAll('loading');


    });

    //iframe层-父子操作
    function add() {
        layer.open({
            type: 2,
            area: ['700px', '450px'],
            fixed: false, //不固定
            maxmin: true,
            content: '/Org/addOrg'
        });
    }

</script>");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
