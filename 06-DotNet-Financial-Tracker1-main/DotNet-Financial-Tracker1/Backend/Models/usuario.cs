using System;

namespace Backend.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

        // Campos para el Factor de Doble Vía (2FA)
        public bool IsTwoFactorEnabled { get; set; } = false; 
        public string? TwoFactorSecret { get; set; } 
    }
}
