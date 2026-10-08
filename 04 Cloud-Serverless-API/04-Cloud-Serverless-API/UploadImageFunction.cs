using Azure;
using Azure.Storage.Blobs;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace _04_Cloud_Serverless_API
{
    public class UploadImageFunction
    {
        private readonly ILogger<UploadImageFunction> _logger;

        public UploadImageFunction(ILogger<UploadImageFunction> logger)
        {
            _logger = logger;
        }

        [Function("UploadImage")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
        {
            _logger.LogInformation("Iniciando la subida de imagen a Azure Blob Storage...");

            // 1. Obtener la cadena de conexión desde la configuración local
            string connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage")
                ?? "UseDevelopmentStorage=true"; // Usa el emulador local por defecto

            try
            {
                // 2. Inicializar el cliente de Azure Blob Storage
                BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);
                BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("imagenes-ecommerce");

                // Crea el contenedor en el emulador/nube si no existe todavía
                await containerClient.CreateIfNotExistsAsync();

                // 3. Generar un nombre único para el archivo (Evita que se sobreescriban)
                string uniqueFileName = $"{Guid.NewGuid()}_imagen.jpg";
                BlobClient blobClient = containerClient.GetBlobClient(uniqueFileName);

                // 4. Leer el contenido del cuerpo de la petición HTTP y subirlo directamente sin preguntar el tamaño
                using (Stream stream = req.Body)
                {
                    // Sube el flujo de datos de la petición directamente a la nube local
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                // 5. Responder con éxito y dar la URL del archivo guardado
                var response = req.CreateResponse(HttpStatusCode.OK);
                response.Headers.Add("Content-Type", "text/plain; charset=utf-8");
                await response.WriteStringAsync($"¡Éxito! Archivo guardado como: {uniqueFileName}\nURI: {blobClient.Uri}");

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al subir el archivo: {ex.Message}");

                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                errorResponse.Headers.Add("Content-Type", "text/plain; charset=utf-8");
                await errorResponse.WriteStringAsync($"Error interno en el servidor Cloud: {ex.Message}");
                return errorResponse;
            }
        }
    }
}
