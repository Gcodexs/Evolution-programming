 ---

# 🚀 ApexTask — Desktop Project Manager

A Windows desktop application developed with **C#, .NET 10, and Windows Forms**, featuring a Kanban-inspired interface for organizing tasks by status.

This project documents the development, build, and executable publishing process using Visual Studio and the .NET toolchain.

## 🖥️ Application Preview

## 🛠️ Technologies Used

- **C#:** The programming language used to develop the application.
- **.NET 10:** The development platform and runtime.
- **Windows Forms:** The framework used to build the graphical user interface.
- **Visual Studio:** The integrated development environment (IDE).
- **MSBuild:** The build system used by .NET projects.
- **Git and GitHub:** Tools for version control and source code hosting.

## 🧩 UI Components

| Component | Purpose |
|---|---|
| `Form` | Represents the main application window. |
| `FlowLayoutPanel` | Arranges controls horizontally or vertically in a flow layout. |
| `Button` | Triggers actions through user interactions and events. |
| `EventHandler` | Handles events, such as button clicks. |

The interface includes three task workflow columns: `PENDING`, `IN PROGRESS`, and `COMPLETED`.

## ⚙️ Build Configuration

### 1. Release Configuration

**What does it mean?**

`Release` is a build configuration intended for distributing an application. It typically enables compiler optimizations and disables certain debugging features associated with the `Debug` configuration.

**Configuration selected in Visual Studio:**

```text
Configuration: Release
Platform: Any CPU
```

This configuration can be selected from the Visual Studio toolbar before building the project.

### 2. Any CPU Platform

**What does it mean?**

`Any CPU` indicates that the .NET assembly is not explicitly restricted to an x86-only or x64-only target. The effective architecture also depends on the project settings and runtime configuration.

This does not mean the application runs on every operating system. ApexTask is designed for Windows.

### 3. Building the Project

**Complete command:**

```bash
dotnet build ApexTask-Desktop.csproj -c Release
```

**Command breakdown:**

- `dotnet build`: Builds the project and its dependencies.
- `ApexTask-Desktop.csproj`: Specifies the project file to build.
- `-c Release`: Selects the Release build configuration.

This command generates the build output in the directory configured by the project.

### 4. Publishing the Application

To prepare a Windows application for distribution, you can use:

```bash
dotnet publish ApexTask-Desktop.csproj -c Release -r win-x64 --self-contained false
```

**Parameter breakdown:**

- `dotnet publish`: Prepares the application and its required files for deployment.
- `-c Release`: Publishes the application using the Release configuration.
- `-r win-x64`: Targets 64-bit Windows.
- `--self-contained false`: Uses the .NET runtime installed on the target computer.

**Note:** This is an example of a reproducible publishing command. It does not necessarily represent the exact command used to generate the output folder shown in the screenshot.

If you need to distribute the application with its .NET runtime included, you can consider self-contained publishing by setting `--self-contained true`.

## 📦 Generated Files

| File | Purpose |
|---|---|
| `ApexTask-Desktop.exe` | Application executable used to launch the program. |
| `ApexTask-Desktop.dll` | .NET assembly containing application code or related components. |
| `ApexTask-Desktop.deps.json` | Describes the application's dependencies. |
| `ApexTask-Desktop.runtimeconfig.json` | Contains runtime configuration information. |
| `ApexTask-Desktop.pdb` | May contain debugging symbols used for troubleshooting and diagnostics. |

The files generated depend on the selected build and publishing configuration.

## ▶️ How to Build the Project

1. Clone the repository.
2. Open `ApexTask-Desktop.csproj` in Visual Studio or navigate to the project directory in a terminal.
3. Restore the project dependencies.
4. Run the build command.
5. Review the generated files in the output directory.

### Restore Dependencies

```bash
dotnet restore ApexTask-Desktop.csproj
```

This command restores the dependencies defined by the project.

### Build in Release Mode

```bash
dotnet build ApexTask-Desktop.csproj -c Release
```

This command compiles the application using the Release configuration.

### Publish for Windows x64

```bash
dotnet publish ApexTask-Desktop.csproj -c Release -r win-x64 --self-contained false
```

This command prepares a framework-dependent deployment targeting 64-bit Windows.

## 📁 Build Output Directory

The screenshot shows a directory named:

```text
Release/net10.0-windows
```

This path identifies a build output directory associated with the Release configuration and the Windows-specific target framework.

The exact output path depends on the project configuration and whether the application was built or published.

## 🎯 Project Goals

- Apply practical C# and .NET development skills.
- Build a Windows desktop application using Windows Forms.
- Explore graphical user interface components and event-driven programming.
- Understand the build and publishing workflow for .NET applications.
- Document technical decisions and commands to make the development process easier to reproduce.

ApexTask is part of my personal software development portfolio and represents my ongoing learning and practical experience with C# and .NET.

---

<img width="1920" height="986" alt="Captura de pantalla (894)" src="https://github.com/user-attachments/assets/0098004b-3f78-4d0c-be8d-ca935706c763" />


**Built with C# · .NET 10 · Windows Forms**
