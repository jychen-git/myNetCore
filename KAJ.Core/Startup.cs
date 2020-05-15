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
            //�Զ������
            services.AddSingleton(new Appsettings(Configuration));//ע�뵽���ò�������
            services.AddSqlsugarSetup();
            // services.AddSingleton<Ixxxx,XXXX>();//�ӿ���newʵ����

            services.AddControllersWithViews();
            services.AddMvc();
        }

        // ע����CreateDefaultBuilder�У����Autofac���񹤳�
        public void ConfigureContainer(ContainerBuilder builder)
        {
            var basePath = AppContext.BaseDirectory;

            #region ���нӿڲ�ķ���ע��
            var servicesDllFile = Path.Combine(basePath, "KAJ.Services.dll");
            var repositoryDllFile = Path.Combine(basePath, "KAJ.Repository.dll");

            if (!(File.Exists(servicesDllFile) && File.Exists(repositoryDllFile)))
            {
                throw new Exception("Repository.dll��service.dll ��ʧ����Ϊ��Ŀ�����ˣ�������Ҫ��F6���룬��F5���У����� bin �ļ��У���������");
            }



            // ��ȡ Service.dll ���򼯷��񣬲�ע��
            var assemblysServices = Assembly.LoadFrom(servicesDllFile);
            builder.RegisterAssemblyTypes(assemblysServices)
                      .AsImplementedInterfaces()
                      .InstancePerDependency()
                      .EnableInterfaceInterceptors();//����Autofac.Extras.DynamicProxy;

            // ��ȡ Repository.dll ���򼯷��񣬲�ע��
            var assemblysRepository = Assembly.LoadFrom(repositoryDllFile);
            builder.RegisterAssemblyTypes(assemblysRepository)
                   .AsImplementedInterfaces()
                   .InstancePerDependency();

            #endregion

            // �����ע��û��ϵ��ֻ�ǻ�ȡע���б������
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
