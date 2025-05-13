
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Configuration;
using System.Text;
using WebAPI.EF;
using WebAPI.Services;
using WebAPI.EF.Models;
using WebAPI.Services.AI;
using WebAPI.Services.Repository;
using WebAPI.Controllers;
using Microsoft.OpenApi.Models;

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

            builder.Services.AddScoped<UserRepository>();
            builder.Services.AddScoped<PlaceRepository>();
            builder.Services.AddScoped<FavoritesRepository>();
            builder.Services.AddScoped<HashtagRepository>();
            builder.Services.AddScoped<AdHashtagRepository>();
            builder.Services.AddScoped<PhotoRepository>();
            builder.Services.AddScoped<HistoryRepository>();
            builder.Services.AddScoped<SearchesRepository>();
            builder.Services.AddScoped<ReviewRepository>();

            builder.Services.AddScoped<AuthorizationService>();
            builder.Services.AddScoped<UserService>();

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

            // JWT для регестрации 
            var jwtConfig = builder.Configuration.GetSection("JwtSettings");
            var secretKey = jwtConfig["Key"];

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    var key = Encoding.UTF8.GetBytes(secretKey);
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtConfig["Issuer"],
                        ValidAudience = jwtConfig["Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(key)
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine($"Authentication failed: {context.Exception}");
                            return Task.CompletedTask;
                        },
                        OnTokenValidated = context =>
                        {
                            Console.WriteLine($"Token validated for {context.Principal.Identity.Name}");
                            return Task.CompletedTask;
                        }
                    };

                });

            builder.Services.AddSingleton(new TokenService(
                jwtConfig["Key"],
                jwtConfig["Issuer"],
                jwtConfig["Audience"]
            ));


            // Настройка авторизации через JWT
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

                
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Введите токен в формате: Bearer {токен}",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            });


            // конвертер для LoginData
            builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new LoginDataConverter());
            });

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

            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseHttpsRedirection();


            app.UseRouting();

            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapGet("/", () => app.Configuration.AsEnumerable());

            app.Run();

        }
    }
}
