using Microsoft.EntityFrameworkCore;
using _03_ECommerce_System.models;

namespace _03_ECommerce_System.data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Estas propiedades se transformarán automáticamente en tus tablas de SQL Server
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Orden> Ordenes { get; set; }
    }
}
