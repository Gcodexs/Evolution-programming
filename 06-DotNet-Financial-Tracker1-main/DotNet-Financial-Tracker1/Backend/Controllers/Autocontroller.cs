using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using OtpNet;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly FinancialContext _context;

        public AuthController(FinancialContext context)
        {
            _context = context;
        }

        // 1. REGISTRO DE USUARIO (Sign Up)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest(new { mensaje = "El correo electrónico ya está registrado." });
            }

            var usuario = new Usuario
            {
                Email = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                FechaRegistro = DateTime.UtcNow,
                IsTwoFactorEnabled = false
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario registrado exitosamente." });
        }

        // 2. INICIO DE SESIÓN (Sign In)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == model.Email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(model.Password, usuario.PasswordHash))
            {
                return Unauthorized(new { mensaje = "Credenciales inválidas." });
            }

            if (usuario.IsTwoFactorEnabled)
            {
                return Ok(new { requiere2FA = true, email = usuario.Email });
            }

            return Ok(new { requiere2FA = false, mensaje = "Login exitoso", email = usuario.Email });
        }

        // 3. CONFIGURAR 2FA (Generar QR y Clave Secreta)
        [HttpPost("2fa/setup")]
        public async Task<IActionResult> Setup2Factor([FromBody] EmailDto model)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (usuario == null) return NotFound(new { mensaje = "Usuario no encontrado." });

            byte[] secretKey = KeyGeneration.GenerateRandomKey(20);
            string base32Secret = Base32Encoding.ToString(secretKey);

            usuario.TwoFactorSecret = base32Secret;
            await _context.SaveChangesAsync();

            string qrCodeUrl = $"otpauth://totp/FinanzasPro:{usuario.Email}?secret={base32Secret}&issuer=FinanzasPro";

            return Ok(new { secret = base32Secret, qrCodeSetupUrl = qrCodeUrl });
        }

        // 4. VERIFICAR Y ACTIVAR 2FA COMPLETAMENTE
        [HttpPost("2fa/verify")]
        public async Task<IActionResult> Verify2Factor([FromBody] Verify2FactorDto model)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (usuario == null || string.IsNullOrEmpty(usuario.TwoFactorSecret)) 
            {
                return BadRequest(new { mensaje = "No se ha iniciado la configuración de 2FA." });
            }

            byte[] secretBytes = Base32Encoding.ToBytes(usuario.TwoFactorSecret);
            var totp = new Totp(secretBytes);

            if (totp.VerifyTotp(model.Code, out long timeWindowUsed))
            {
                usuario.IsTwoFactorEnabled = true;
                await _context.SaveChangesAsync();
                return Ok(new { verificado = true, mensaje = "2FA activado correctamente." });
            }

            return BadRequest(new { mensaje = "Código de verificación incorrecto o expirado." });
        }
    }

    public class RegisterDto { public string Email { get; set; } = string.Empty; public string Password { get; set; } = string.Empty; }
    public class LoginDto { public string Email { get; set; } = string.Empty; public string Password { get; set; } = string.Empty; }
    public class EmailDto { public string Email { get; set; } = string.Empty; }
    public class Verify2FactorDto { public string Email { get; set; } = string.Empty; public string Code { get; set; } = string.Empty; }
}
