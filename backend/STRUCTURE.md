# Backend Folder & Layer Structure

The backend API follows a layered "Clean Architecture" pattern to ensure maintainability, testability, and scalability.

---

## 📁 Layer Breakdown

### 🎮 `controllers/`
- **Responsibility**: HTTP Request Layer.
- Extracts incoming parameters from `req.body`, `req.query`, and `req.params`.
- Handles input validation (using `express-validator`).
- Delegates business logic to the appropriate **Service**.
- Formats standardized API responses (`sendResponse(res, { success, data, message, error }, statusCode)`).

### 🧠 `services/`
- **Responsibility**: Business Logic & Orchestration Layer.
- Implements application business rules (authentication, OTP generation, project workflows).
- Orchestrates multi-repository operations (e.g., syncing User and Student profile collections).
- Calculates dashboard metrics and aggregate performance statistics.
- Manages notification dispatching and audit trail creation.

### 🗃️ `repositories/`
- **Responsibility**: Data Access Layer.
- Abstracts Mongoose collection queries (`findAll`, `findOne`, `findById`, `create`, `update`, `delete`).
- Applies query options such as `sort`, `skip`, `limit`, `populate`, and `select`.
- Separates database execution syntax from business logic.

### 📜 `models/`
- **Responsibility**: Domain Entities & Database Schemas.
- Defines Mongoose schemas (`User`, `Student`, `Staff`, `Project`, `OTP`, `Meeting`, `Notification`, `Resource`, `Activity`, `AuditLog`).
- Enforces data field constraints, default values, and pre-save hooks (e.g., password hashing).
- Configures compound database indexes for query performance (`role + status`, `status + updatedAt`, `user + read + createdAt`).

### 🛣️ `routes/`
- **Responsibility**: Express Endpoint Routing.
- Maps HTTP request methods (`GET`, `POST`, `PUT`, `DELETE`) and paths to Controller handlers.
- Attaches Authentication (`auth.js`) and Role Authorization (`roleMiddleware.js`) guards.

### 🛡️ `middleware/`
- **Responsibility**: HTTP Processing Pipeline.
- **Authentication**: JWT token verification and user context binding (`req.user`).
- **Authorization**: Role-Based Access Control (`checkRole(['admin', 'faculty'])`).
- **Validation**: Schema parameter validation via `express-validator`.
- **Error Handling**: Global catch-all middleware (`errorHandler.js`).

### 🛠️ `utils/`
- **Responsibility**: Reusable Utilities & Helpers.
- `email.js`: Singleton Nodemailer pool (`pool: true`) with Brevo & Resend API fallbacks.
- `response.js`: Standardized JSON API response formatter.
- `logger.js`: Winston/Morgan logger module.
- `encryption.js`: Password encryption/decryption helpers.

### 🧪 `tests/`
- **Responsibility**: Automated QA & Integration Testing.
- Uses Mocha, Chai, and Supertest to validate endpoints (Auth, Projects, Users, Students, Notifications, Resources).

---

## 🔄 Request & Response Execution Flow

```text
1. Client Request -> Hits endpoint in routes/
2. Middleware      -> Validates JWT token & checks user role permissions (RBAC)
3. Controller      -> Parses & validates request payload, then calls Service function
4. Service         -> Executes business rules & calls Repository methods
5. Repository      -> Queries MongoDB via Mongoose schema & returns lean documents
6. Service         -> Processes data & returns result object to Controller
7. Controller      -> Wraps result in standardized JSON format & sends HTTP response
```
