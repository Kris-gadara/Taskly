# Backend (.NET 8 Web API)

This folder contains the ASP.NET Core Web API backend for the Task Manager project.

## Features

- CRUD endpoints for Task (id, title, description, isCompleted)
- MongoDB integration via MongoDB.Driver
- Repository pattern & dependency injection
- CORS enabled for frontend access

## Setup Instructions

1. **Install .NET 8 SDK**

   - https://dotnet.microsoft.com/download/dotnet/8.0

2. **Install MongoDB**

   - https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas for cloud database

3. **Configure MongoDB connection string**

   - Update `appsettings.json` with your MongoDB connection string

4. **Restore dependencies & run API**

   ```powershell
   cd backend
   dotnet restore
   dotnet run
   ```

5. **API will run on http://localhost:5000 (default)**

---
