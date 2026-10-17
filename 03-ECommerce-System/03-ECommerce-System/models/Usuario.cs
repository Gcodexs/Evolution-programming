namespace _03_ECommerce_System.models
{
    public class Usuario
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        // Guardaremos la contraseña encriptada por seguridad general
        public string PasswordHash { get; set; } = string.Empty;

        public string Rol { get; set; } = "Cliente"; // Puede ser 'Cliente' o 'Administrador'
    }
}
