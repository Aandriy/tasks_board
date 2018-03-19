using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using App.Models;
using React.AspNet;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using App.Areas.Auth.Models;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using App.Filters;
using App.Interfaces;
using App.Implementation;

namespace App
{
	public class Startup
	{
		public Startup(IConfiguration configuration, IHostingEnvironment env)
		{
			Configuration = configuration;
			HostingEnvironment = env;
		}
		public IConfiguration Configuration { get; }

		public IHostingEnvironment HostingEnvironment { get; }

		public IServiceProvider ConfigureServices(IServiceCollection services)
		{
			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
			services.AddReact();
			services.AddDbContext<ApplicationDbContext>(options =>
				options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

			services.AddIdentity<User, IdentityRole>()
				.AddEntityFrameworkStores<ApplicationDbContext>()
				.AddDefaultTokenProviders();

			services.AddMvc()
				.AddMvcOptions(p =>
				{
					p.Filters.Add(new CustomErrorFilter(HostingEnvironment.IsDevelopment()));
				}).AddJsonOptions(options =>
			{
				options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
				options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
			});

			
			services.AddSingleton<IMailService, MailService>();




			return services.BuildServiceProvider();
		}

		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			
			app.UseCors(builder => builder.AllowAnyOrigin());
			app.UseDefaultFiles();
			app.UseStaticFiles();
			app.UseAuthentication();

			app.UseMvc(routes =>
			{
				routes.MapRoute(
					name: "areasApi",
					template: "api/{area:exists}/{controller}/{action}/{id?}");

				routes.MapRoute(
					name: "WithActionApi",
					template: "api/{controller}/{action}/{id?}");

				routes.MapRoute(
					name: "DefaultApi",
					template: "api/{controller}/{id?}");
			});
		}
	}
}
