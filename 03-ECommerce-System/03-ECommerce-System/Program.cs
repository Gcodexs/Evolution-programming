using Microsoft.EntityFrameworkCore;
using _03_ECommerce_System.data;

var builder = WebApplication.CreateBuilder(args);

// 1. REGISTRAR LOS CONTROLADORES (Esencial)
builder.Services.AddControllers();

// 2. CONEXIÓN A LA BASE DE DATOS
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. REGISTRAR OPENAPI NATIVO (.NET Core)
builder.Services.AddOpenApi();

var app = builder.Build();

// 4. CONFIGURACIÓN DEL ENTORNO DE DESARROLLO
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// 5. TUBERÍA DE PETICIONES (MIDDLEWARES) - Fuera del IF para estabilidad
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers(); // Esto activa ProductosController

app.Run();
