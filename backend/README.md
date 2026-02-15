# Student Project System Backend

## Architecture Overview

- **Clean Architecture**: Controllers handle HTTP, delegate to services for business logic, and services interact with models.
- **Centralized Routing**: All routes are loaded via `src/routes/index.js` and mounted under `/api/v1`.
- **Middleware**: Global error handler, request validation, authentication, authorization, logging, and security (helmet, CORS, rate limiting).
- **Consistent API Response**: All endpoints return `{ success, data, message, errors }`.
- **Environment Config**: Use `.env` for secrets and environment-specific settings.


### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

   ```sh
   git clone <your-repo-url>
   cd backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in your values (see below).

4. Start the server:

   ```sh
   npm start
   # or for development
   npm run dev
   ```

5. Run tests:

   ```sh
   npm test
   ```

### Example .env

```env
MONGO_URI=mongodb://localhost:27017/student_project_system
JWT_SECRET=supersecretkey
PORT=5000
API_BASE_URL=http://localhost:5000/api/v1

TOKEN_EXPIRES_IN=1d
```
	```sh
	npm start
	# or for development
	npm run dev
	```
5. Visit Swagger docs at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
6. Run tests:
	```sh
	npm test
	```

### Example .env
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/student_project_system
JWT_SECRET=your_jwt_secret
```



## Folder Structure

- `controllers/` — HTTP layer (request/response, validation)
- `services/` — Business logic (data processing, DB access)
- `models/` — Mongoose models (schema definitions)
- `routes/` — Route definitions (REST endpoints)
- `middleware/` — Middleware (auth, error, logger, validation, RBAC)
- `utils/` — Utilities (ApiError, response, helpers)
- `tests/` — Automated tests (Mocha/Chai/Supertest)
## API Usage

- All endpoints are prefixed with `/api/v1` (or as configured in `server.js`).
- Use JWT authentication for protected routes (see `/auth/login`).
- See live API docs and try endpoints at `/api-docs` (Swagger UI).

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



## Deployment Guide

Follow these steps to deploy the backend to a production environment:

1. **Clone the repository**
	```sh
	git clone <your-repo-url>
	cd backend
	```
2. **Install dependencies**
	```sh
	npm install
	```
3. **Set up environment variables**
	- Copy `.env.example` to `.env` and fill in production values (MongoDB URI, JWT secret, etc.)
4. **Set up MongoDB**
	- Use a managed service (MongoDB Atlas) or self-hosted MongoDB instance
	- Ensure your database is accessible from your server
5. **Run database migrations/seed (if any)**
	- (Optional) Add scripts for initial data or indexes
6. **Start the server with a process manager**
	- Recommended: [PM2](https://pm2.keymetrics.io/)
	```sh
	npm install -g pm2
	pm2 start server.js --name student-project-system
	pm2 save
	pm2 startup
	```
7. **Configure HTTPS and reverse proxy**
	- Use Nginx or Apache to proxy requests to Node.js and enable SSL
	- Example Nginx config:
	  ```nginx
	  server {
		 listen 80;
		 server_name your-domain.com;
		 location / {
			proxy_pass http://localhost:3000;
			proxy_set_header Host $host;
			proxy_set_header X-Real-IP $remote_addr;
			proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
			proxy_set_header X-Forwarded-Proto $scheme;
		 }
	  }
	  ```
	- Use Let's Encrypt for free SSL certificates
8. **Set up environment hardening**
	- Set `NODE_ENV=production`
	- Enable CORS, Helmet, and rate limiting (already included)
	- Use strong secrets and secure cookies
9. **Monitor and log**
	- Use PM2 logs, or integrate with a logging/monitoring service
10. **Automate with CI/CD (optional)**
	 - Use GitHub Actions, GitLab CI, or similar for automated testing and deployment

---

For troubleshooting and advanced deployment (Docker, cloud platforms), see the official Node.js and MongoDB documentation.

---


## Contributing

1. Fork the repo and create a feature branch.
2. Write clear, maintainable code with comments for all exported functions and complex logic.
3. Add/modify tests for new features.
4. Open a pull request with a clear description.

---

For more details, see code comments and individual module documentation.

---

### Key Features
- Role-based access control (RBAC) for sensitive endpoints
- Pagination and filtering for all list endpoints
- Swagger/OpenAPI documentation at `/api-docs`
- Centralized error and validation handling
- Inline code comments for maintainability
