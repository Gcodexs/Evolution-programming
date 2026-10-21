using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class FinancialContext : DbContext
    {
        public FinancialContext(DbContextOptions<FinancialContext> options) : base(options) { }

        // Tabla para tus transacciones financieras
        public DbSet<Transaction> Transactions { get; set; }
        
        // Tabla para el registro de usuarios con seguridad
        public DbSet<Usuario> Usuarios { get; set; }
    }
}

