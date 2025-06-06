using Application.Services;
using Application.Services.AI;
using Application.Services.Email;
using Application.Services.Payment;
using Entities;
using Infrastructure;
using Infrastructure.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

namespace WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            if (builder.Environment.EnvironmentName == "vm")
            {
                builder.Configuration.AddJsonFile("/home/test-demo/AroundMe/configs/mysettings.vm.webapi.json", optional: false, reloadOnChange: true);

                builder.WebHost.ConfigureKestrel((context, options) =>
                {
                    options.Configure(context.Configuration.GetSection("Kestrel"));
                });
            }

            //подключаем сервис конфига
            builder.Services.Configure<Config>(builder.Configuration.GetSection("MapSettings"));

            //Достаем через костыли натсройки
            Config mapSettings = builder.Configuration.GetSection("MapSettings").Get<Config>()!;
            builder.Services.AddSingleton<Config>(mapSettings);

            string sqliteConnString = mapSettings.SQLiteConnectionString;
            builder.Services.AddInfrastructure(sqliteConnString);

            builder.Services.AddScoped<UserRepository>();
            builder.Services.AddScoped<PlaceRepository>();
            builder.Services.AddScoped<FavoritesRepository>();
            builder.Services.AddScoped<HashtagRepository>();
            builder.Services.AddScoped<AdHashtagRepository>();
            builder.Services.AddScoped<PhotoRepository>();
            builder.Services.AddScoped<HistoryRepository>();
            builder.Services.AddScoped<SearchesRepository>();
            builder.Services.AddScoped<ReviewRepository>();
            builder.Services.AddScoped<ConfirmationCodeRepository>();

            builder.Services.AddScoped<AuthorizationService>();
            builder.Services.AddScoped<UserService>();
            builder.Services.AddScoped<TokenService>();
            builder.Services.AddScoped<PlaceService>();
            builder.Services.AddScoped<HistoryService>();
            builder.Services.AddScoped<ReviewService>();

            builder.Services.AddScoped<WtfService>();

            builder.Services.AddScoped<EmailTemplateService>();
            builder.Services.AddScoped<EmailConfirmationService>();
            builder.Services.AddScoped<IMail, MailService>();

            builder.Services.AddHttpClient<GmapsService>(client =>
            {
                client.BaseAddress = new Uri("https://places.googleapis.com/v1/");
            });

            builder.Services.AddScoped<Aplication.Services.PhotoDownloadService>();
            builder.Services.AddHttpClient<Aplication.Services.PhotoDownloadService>();

            builder.Services.AddHttpClient<PayPalService>();

            builder.Services.AddHostedService<OrderService>();
            builder.Services.AddScoped<OrderService>();

            builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
            });

            //DeepSeek
            string? DeepSeekKey = mapSettings.DeepSeekKey;
            builder.Services.AddHttpClient<IAIService, DeepSeekService>(client =>
            {
                client.BaseAddress = new Uri("https://api.deepseek.com");
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {DeepSeekKey}");
                client.Timeout = TimeSpan.FromSeconds(60);
            });

            //Ollama 

            //var useOllama = mapSettings.UseOllama;
            //var ollamaUrl = mapSettings.OllamaUrl;
            //var ollamaPort = mapSettings.OllamaPort;
            //var modelName = mapSettings.OllamaModelName;

            //if (useOllama && (!string.IsNullOrEmpty(ollamaUrl) && ollamaPort.HasValue && !string.IsNullOrEmpty(modelName)))
            //{
            //    var baseAddress = $"{ollamaUrl}:{ollamaPort}";

            //    builder.Services.AddHttpClient<IAIService, OllamaService>(client =>
            //    {
            //        client.BaseAddress = new Uri(baseAddress);
            //    });
            //}
            //else
            //{
            //    Console.WriteLine("Ollama settings are missing or invalid!");
            //}

            // JWT для регестрации 

            var jwtConfig = builder.Configuration.GetSection("JwtSettings");
            var secretKey = jwtConfig["Key"];

            builder.Services.Configure<JwtConfig>(jwtConfig);

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


            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // Добавляем CORS с двумя политиками
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("https://app.aroundme.pp.ua")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });

                options.AddPolicy("AllowReact", policy =>
                {
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
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

            if (!app.Environment.IsEnvironment("vm"))
            {
                app.UseHttpsRedirection();
            }


            if (app.Environment.IsEnvironment("vm"))
            {
                app.UseCors("AllowFrontend"); // 👈 прод
            }
            else
            {
                app.UseCors("AllowReact"); // 👈 dev
            }


            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapGet("/", () => app.Configuration.AsEnumerable());

            app.Run();


        }
    }
}
