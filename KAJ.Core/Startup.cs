using Autofac;
using Autofac.Extras.DynamicProxy;
using KAJ.Common.Helper;
using KAJ.Core.DI;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace KAJ.Core
{
    public class Startup
    {
        private List<Type> tsDIAutofac = new List<Type>();

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //自定义加入
            services.AddSingleton(new Appsettings(Configuration));//注入到配置操作类中
            services.AddSqlsugarSetup();
            // services.AddSingleton<Ixxxx,XXXX>();//接口类new实现类

            services.AddControllersWithViews();
            services.AddMvc();
        }

        // 注意在CreateDefaultBuilder中，添加Autofac服务工厂
        public void ConfigureContainer(ContainerBuilder builder)
        {
            var basePath = AppContext.BaseDirectory;

            #region 带有接口层的服务注入
            var servicesDllFile = Path.Combine(basePath, "KAJ.Services.dll");
            var repositoryDllFile = Path.Combine(basePath, "KAJ.Repository.dll");

            if (!(File.Exists(servicesDllFile) && File.Exists(repositoryDllFile)))
            {
                throw new Exception("Repository.dll和service.dll 丢失，因为项目解耦了，所以需要先F6编译，再F5运行，请检查 bin 文件夹，并拷贝。");
            }



            // 获取 Service.dll 程序集服务，并注册
            var assemblysServices = Assembly.LoadFrom(servicesDllFile);
            builder.RegisterAssemblyTypes(assemblysServices)
                      .AsImplementedInterfaces()
                      .InstancePerDependency()
                      .EnableInterfaceInterceptors();//引用Autofac.Extras.DynamicProxy;

            // 获取 Repository.dll 程序集服务，并注册
            var assemblysRepository = Assembly.LoadFrom(repositoryDllFile);
            builder.RegisterAssemblyTypes(assemblysRepository)
                   .AsImplementedInterfaces()
                   .InstancePerDependency();

            #endregion

            // 这里和注入没关系，只是获取注册列表，请忽略
            tsDIAutofac.AddRange(assemblysServices.GetTypes().ToList());
            tsDIAutofac.AddRange(assemblysRepository.GetTypes().ToList());
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "UI",
                    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });


        }
    }
}
