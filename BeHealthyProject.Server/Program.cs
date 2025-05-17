using BeHealthyProject.BusinessLayer.Abstract;
using BeHealthyProject.BusinessLayer.Concrete;
using BeHealthyProject.BusinessLayer.Hubs;
using BeHealthyProject.Entities;
using BeHealthyProject.Server.Data;
using BeHealthyProject.Server.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();


var conn = builder.Configuration.GetConnectionString("Default");
builder.Services.AddDbContext<BeHealthyDbContext>(options =>
{
	options.UseSqlServer(conn);
});
builder.Services.AddHttpClient();

builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAll",
		builder => builder
			.WithOrigins("https://localhost:5173") 
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials());
});


builder.Services.AddIdentity<BaseUser, IdentityRole>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
})
.AddEntityFrameworkStores<BeHealthyDbContext>()
.AddDefaultTokenProviders();


builder.Services.AddDistributedMemoryCache();

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			ValidIssuer = builder.Configuration["Jwt:Issuer"],
			ValidAudience = builder.Configuration["Jwt:Audience"],
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
		};
		options.Events = new JwtBearerEvents
		{
			OnMessageReceived = context =>
			{
				var accessToken = context.Request.Query["access_token"];
				var path = context.HttpContext.Request.Path;

				if (!string.IsNullOrEmpty(accessToken) &&
					path.StartsWithSegments("/hub/notifications"))
				{
					context.Token = accessToken;
				}

				return Task.CompletedTask;
			}
		};
	});

builder.Services.AddAuthorization(options =>
{
	options.AddPolicy("DietitianPolicy", policy =>
	{
		policy.RequireRole("Dietitian");
	});

	options.AddPolicy("UserPolicy", policy =>
	{
		policy.RequireRole("User");
	});
});
builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();
builder.Services.AddScoped<IDietitianService,DietitianService>();
builder.Services.AddScoped<ISubscribeService,SubscribeService>();



var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
app.UseMiddleware<GlobalErrorHandlerMiddleware>();
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapHub<NotificationHub>("/hub/notifications");

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
