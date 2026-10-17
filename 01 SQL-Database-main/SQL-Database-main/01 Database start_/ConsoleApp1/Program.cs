using Microsoft.Data.Sqlite;

// 1. Nombre de tu archivo de base de datos local
string datosConexion = "Data Source=MiTiendaLocal.db";

Console.WriteLine("=== MI MENTORÍA DE BASES DE DATOS ===");
Console.WriteLine("Conectando a la base de datos local...");

try
{
    // 2. Abrir la conexión
    using var conexion = new SqliteConnection(datosConexion);
    conexion.Open();

    // 3. APRENDIZAJE SQL: Crear la tabla si no existe
    string scriptTabla = @"
        CREATE TABLE IF NOT EXISTS Productos (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Nombre TEXT NOT NULL,
            Precio REAL NOT NULL
        );";
    using var comandoTabla = new SqliteCommand(scriptTabla, conexion);
    comandoTabla.ExecuteNonQuery();
    Console.WriteLine("[SQL] Tabla 'Productos' verificada/creada con éxito.");

    // 4. APRENDIZAJE SQL: Insertar un producto de prueba
    string scriptInsertar = "INSERT INTO Productos (Nombre, Precio) VALUES ('Teclado Gamer RGB', 45000);";
    using var comandoInsertar = new SqliteCommand(scriptInsertar, conexion);
    comandoInsertar.ExecuteNonQuery();
    Console.WriteLine("[SQL] ¡Producto 'Teclado Gamer RGB' guardado en la base de datos!");

    // 5. APRENDIZAJE SQL: Leer lo que guardamos
    string scriptLeer = "SELECT * FROM Productos;";
    using var comandoLeer = new SqliteCommand(scriptLeer, conexion);
    using var lector = comandoLeer.ExecuteReader();

    Console.WriteLine("\n=== PRODUCTOS EN LA BASE DE DATOS ===");
    while (lector.Read())
    {
        Console.WriteLine($"ID: {lector["Id"]} | Producto: {lector["Nombre"]} | Precio: ${lector["Precio"]}");
    }
}
catch (Exception error)
{
    Console.WriteLine("Hubo un error en la operación:");
    Console.WriteLine(error.Message);
}

// Detener la pantalla para ver el resultado
Console.WriteLine("\nPresiona cualquier tecla para salir...");
Console.ReadKey();
