
using Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            if (builder.Environment.EnvironmentName == "vm")
            {
                builder.Configuration.AddJsonFile("/home/test-demo/AroundMe/configs/mysettings.vm.adminpanel.json", optional: false, reloadOnChange: true);

                builder.WebHost.ConfigureKestrel((context, options) =>
                {
                    options.Configure(context.Configuration.GetSection("Kestrel"));
                });
            }

            // Äëÿ SQL Server
            builder.Services.AddDbContext<MyDbContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add services to the container.
            builder.Services.AddRazorPages();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
            }
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapRazorPages();

            app.Run();
        }
    }
}
