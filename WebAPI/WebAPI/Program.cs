
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Configuration;
using WebAPI.EF;
using WebAPI.Services.AI;

namespace WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //подключаем сервис конфига
            builder.Services.Configure<Config>(builder.Configuration.GetSection("MapSettings"));

            //Достаем через костыли натсройки
            var mapSettings = builder.Configuration.GetSection("MapSettings").Get<Config>();

            var connString = mapSettings.BDConnectionString;
            var dbServerVersion = mapSettings.DBServerVersion;
            builder.Services.AddDbContext<MyDbContext>(options => options.UseMySql(
                connString,
                Microsoft.EntityFrameworkCore.ServerVersion.Parse(dbServerVersion))
            );

            //DeepSeek
            var DeepSeekKey = mapSettings.DeepSeekKey;
            builder.Services.AddHttpClient<IAIService, DeepSeekService>(client =>
            {
                client.BaseAddress = new Uri("https://api.deepseek.com");
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {DeepSeekKey}");
                client.Timeout = TimeSpan.FromSeconds(60);
            });

            //Ollama 

            var useOllama = mapSettings.UseOllama;
            var ollamaUrl = mapSettings.OllamaUrl;
            var ollamaPort = mapSettings.OllamaPort;
            var modelName = mapSettings.OllamaModelName;

            if (useOllama && (!string.IsNullOrEmpty(ollamaUrl) && ollamaPort.HasValue && !string.IsNullOrEmpty(modelName)))
            {
                var baseAddress = $"{ollamaUrl}:{ollamaPort}";

                builder.Services.AddHttpClient<IAIService, OllamaService>(client =>
                {
                    client.BaseAddress = new Uri(baseAddress);
                });
            }
            else
            {
                Console.WriteLine("Ollama settings are missing or invalid!");
            }


            builder.Services.AddControllers();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy => policy.AllowAnyOrigin()
                                    .AllowAnyMethod()
                                    .AllowAnyHeader());
            });

            var app = builder.Build();


            app.UseCors("AllowAll");

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();

            app.MapGet("/", () => app.Configuration.AsEnumerable());

            app.Run();




        }
    }
}
