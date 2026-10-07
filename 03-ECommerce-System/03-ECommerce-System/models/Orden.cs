using System;

namespace _03_ECommerce_System.models
{
    public class Orden
    {
        public int Id { get; set; }

        // Relación con el Usuario (Llave Foránea)
        public int UsuarioId { get; set; }

        public DateTime FechaCompra { get; set; } = DateTime.Now;

        public decimal Total { get; set; }
    }
}
