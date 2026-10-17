using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _03_ECommerce_System.data;
using _03_ECommerce_System.models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace _03_ECommerce_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Inyección de dependencias para usar el puente de la base de datos
        public ProductosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/productos (Obtener todos los productos)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            return await _context.Productos.ToListAsync();
        }

        // POST: api/productos (Agregar un producto nuevo)
        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(Producto producto)
        {
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductos), new { id = producto.Id }, producto);
        }
    }
}
