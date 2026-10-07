### 📂 Project 04: Cloud Serverless API

**Cloud-based backend API** developed with **C#/.NET 8 and Azure Functions**, implementing **HTTP-based image upload, binary data processing, and object storage through Azure Blob Storage**.

The application uses a **serverless architecture** with **.NET 8 Isolated Worker**, integrating **Azure Storage SDK** for programmatic interaction with Blob containers and **Azurite** for local cloud-storage emulation.

### 💡 Project Features & Architecture

* **HTTP API:** Receives image files through an HTTP `POST` endpoint.
* **Serverless Computing:** Uses **Azure Functions with .NET 8 Isolated Worker** to execute the backend logic on demand.
* **Cloud Object Storage:** Uses **Azure Blob Storage** to store uploaded images.
* **Binary Stream Processing:** Processes incoming image data directly from the HTTP request.
* **Local Cloud Simulation:** Uses **Azurite** to emulate Azure Storage locally during development and testing.

---

### ⚙️ Fundamental Project Commands

The following commands were used to configure the required dependencies, start the local server environment, and test the API by sending an image file.

Package Installation — Azure Storage SDK

```powershell
Install-Package Azure.Storage.Blobs
```

**Used for:** Installing the official Azure Storage SDK required for communication between the .NET application and Blob Storage.

**Purpose:** Provides classes such as `BlobServiceClient` and `BlobContainerClient`, allowing the application to connect to storage containers and upload files programmatically.

---

API Endpoint Testing — PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:7228/api/UploadImage" -Method Post -InFile (Get-Item "$HOME\Downloads\Imagen*").FullName -ContentType "image/jpeg"
```

**Used for:** Testing the image upload endpoint without requiring a graphical user interface.

**Purpose:** Sends an image file as a binary payload through an HTTP `POST` request to the `UploadImage` endpoint.

Implemented and tested a backend service capable of receiving image files through an HTTP endpoint and storing them using **Azure Blob Storage**, with **Azurite** providing a local environment for cloud-storage development and testing.
