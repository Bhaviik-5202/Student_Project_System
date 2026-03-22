# Student Project System – Backend

![Node.js CI](https://img.shields.io/github/actions/workflow/status/Bhaviik-5202/Student_Project_System/node.js.yml?style=flat-square)
![License](https://img.shields.io/github/license/Bhaviik-5202/Student_Project_System?style=flat-square)

Backend API for managing student projects, users, assignments, and more. Built with Node.js, Express, and MongoDB.

---

## 🚀 Features

- **Clean Architecture**: Controllers → Services → Models
- **Role-Based Access Control (RBAC)**: Restrict endpoints by user role
- **JWT Authentication**: Secure protected routes
- **Consistent API Response**: `{ success, data, message, errors }`
- **Swagger/OpenAPI Docs**: Interactive docs at `/api-docs`
- **Pagination & Filtering**: For all list endpoints
- **Centralized Error Handling**: Robust error and validation middleware
- **Logging & Security**: Helmet, CORS, rate limiting, and audit logs
- **Automated Tests**: Mocha, Chai, Supertest

---

## 📁 Folder Structure

See [STRUCTURE.md](STRUCTURE.md) for a detailed breakdown.

Key folders:

- `controllers/` – HTTP layer (request/response, validation)
- `services/` – Business logic (data processing, DB access)
- `models/` – Mongoose models (schema definitions)
- `routes/` – Route definitions (REST endpoints)
- `middleware/` – Middleware (auth, error, logger, validation, RBAC)
- `repositories/` – Data access layer
- `utils/` – Utilities (ApiError, response, helpers)
- `tests/` – Automated tests (Mocha/Chai/Supertest)

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

1. **Clone the repository**
   ```sh
   git clone <your-repo-url>
   cd backend
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure environment variables**
   - Copy `.env.example` to `.env` and fill in your values (see `.env.example` for required keys)
4. **Start the server**
   ```sh
   npm start
   # or for development
   npm run dev
   ```
5. **API Documentation**
   - Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) for Swagger UI
6. **Run tests**
   ```sh
   npm test
   ```

---

## 🔒 Authentication & Authorization

- All protected endpoints require a JWT in the `Authorization` header: `Bearer <token>`
- Role-based access enforced via middleware (see `middleware/roleMiddleware.js`)

---

## 📚 API Usage

All endpoints are prefixed with `/api/v1` (see `server.js`).

### Example: Create Project (admin/faculty only)

```http
POST /api/v1/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "AI Research Portal",
  "description": "A portal for AI student projects",
  "status": "planning"
}
```

### Example: Paginated List

```http
GET /api/v1/projects?page=2&limit=5&status=completed
Authorization: Bearer <token>
```

---

## 🚀 Deployment Guide

1. **Clone the repository & install dependencies**
2. **Set up environment variables** (`.env`)
3. **Set up MongoDB** (Atlas or self-hosted)
4. **(Optional) Run database seed/migrations**
5. **Start the server with a process manager** (e.g., [PM2](https://pm2.keymetrics.io/))
   ```sh
   npm install -g pm2
   pm2 start server.js --name student-project-system
   pm2 save
   pm2 startup
   ```
6. **Configure HTTPS & reverse proxy** (Nginx/Apache)
7. **Set `NODE_ENV=production` and harden environment**
8. **Monitor and log** (PM2 logs, or integrate with a logging/monitoring service)
9. **Automate with CI/CD (optional)**

---

## 🤝 Contributing

1. Fork the repo and create a feature branch
2. Write clear, maintainable code with comments for all exported functions and complex logic
3. Add/modify tests for new features
4. Open a pull request with a clear description

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙋‍♂️ Support & Questions

For troubleshooting, see code comments, module docs, or open an issue.

---

## ⭐ Highlights

- Role-based access control (RBAC)
- Pagination and filtering for all list endpoints
- Swagger/OpenAPI documentation at `http://localhost:5000/api-docs`
- Centralized error and validation handling
- Inline code comments for maintainability
- Automated tests with Mocha, Chai, Supertest
