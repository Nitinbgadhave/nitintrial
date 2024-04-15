
using CreditAndDebit.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CreditAndDebit.Data;

namespace CreditAndDebit
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<DataBaseAPIContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DataBaseAPIContext") ?? throw new InvalidOperationException("Connection string 'DataBaseAPIContext' not found.")));

            
            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            builder.Services.AddCors(options =>    //Added new for getting error in html for that purpose we added this line 
            {
                options.AddPolicy("AllowOrigin", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });

            builder.Services.AddSingleton<GoogleSheetsService>();
            var app = builder.Build();

            app.UseCors("AllowOrigin");//Added new for getting error in html for that purpose we added this line 


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
