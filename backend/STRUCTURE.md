# Backend Folder Structure

This project follows a layered "Clean Architecture" pattern to ensure maintainability, testability, and scalability.

## 📁 Directory Breakdown

### 🎮 `controllers/`

- **Responsibility**: HTTP Layer.
- Handles incoming requests, extracts data from `req.body` or `req.params`.
- Performs basic request validation (using `express-validator`).
- Calls the appropriate **Service** to handle business logic.
- Sends standardized responses using the `sendResponse` utility.

### 🧠 `services/`

- **Responsibility**: Business Logic Layer.
- Contains the core application logic (e.g., authentication, project workflows).
- Interacts with **Repositories** or **Models** for data persistence.
- Orchestrates complex operations involving multiple models or external services (e.g., notifications).

### 🗃️ `repositories/`

- **Responsibility**: Data Access Layer.
- Encapsulates database queries using Mongoose.
- Provides a clean interface for services to perform CRUD operations.
- Allows for easy swapping of data sources if needed in the future.

### 📜 `models/`

- **Responsibility**: Domain Entities / Schemas.
- Defines Mongoose schemas and models (e.g., User, Project, Student).
- Includes hooks (like `pre-save`) for tasks like password hashing.

### 🛣️ `routes/`

- **Responsibility**: Endpoint Definitions.
- Maps HTTP methods and paths to Controller functions.
- Applies middleware (Auth, RBAC) to specific routes.

### 🛡️ `middleware/`

- Standard Express middleware for:
  - **Authentication**: JWT verification.
  - **Authorization**: Role-based access control (RBAC).
  - **Logging**: Morgan and custom console logging.
  - **Error Handling**: Global catch-all for errors.

### 🛠️ `utils/`

- Reusable helper functions:
  - `ApiError`: Custom error class.
  - `response`: Standardized JSON response formatter.
  - `helpers`: General utility functions.

---

## 🔄 Execution Flow

1. **Request** hits a route in `routes/`.
2. **Middleware** (if any) validates the JWT or user role.
3. **Controller** processes the request and calls a **Service**.
4. **Service** executes business logic and interacts with the **Repository/Model**.
5. **Controller** receives the result and sends a **Standardized Response**.
