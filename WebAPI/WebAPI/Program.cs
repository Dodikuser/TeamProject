using Application;
using Application.Services;
using Application.Services.AI;
using Entities;
using Infrastructure;
using Infrastructure.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;


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
            Config mapSettings = builder.Configuration.GetSection("MapSettings").Get<Config>()!;
            builder.Services.AddSingleton<Config>(mapSettings);

            string sqliteConnString = mapSettings.SQLiteConnectionString;
            builder.Services.AddInfrastructure(builder.Configuration);

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
            builder.Services.AddScoped<TokenService>();
            builder.Services.AddScoped<GmapsService>();


            //DeepSeek
            string? DeepSeekKey = mapSettings.DeepSeekKey;
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
