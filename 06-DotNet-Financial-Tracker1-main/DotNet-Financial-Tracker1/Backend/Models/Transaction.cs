namespace Backend.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Type { get; set; } = "Ingreso"; // "Ingreso" o "Gasto"
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
