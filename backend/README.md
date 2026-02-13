# Student Project System Backend

## Architecture Overview

- **Clean Architecture**: Controllers handle HTTP, delegate to services for business logic, and services interact with models.
- **Centralized Routing**: All routes are loaded via `src/routes/index.js` and mounted under `/api/v1`.
- **Middleware**: Global error handler, request validation, authentication, authorization, logging, and security (helmet, CORS, rate limiting).
- **Consistent API Response**: All endpoints return `{ success, data, message, errors }`.
- **Environment Config**: Use `.env` for secrets and environment-specific settings.

## Best Practices

- **Controllers**: Thin, only handle req/res and error forwarding.
- **Services**: All business logic and DB access.
- **Error Handling**: Use `ApiError` and centralized error middleware.
- **Validation**: Use `express-validator` and `validateRequest` middleware.
- **Logging**: HTTP logs via morgan, error logs via console (improve for production).
- **Security**: Helmet, CORS, and rate limiting enabled by default.
- **Testing**: Place tests in `/tests`, use Jest or Mocha, and Supertest for API.
- **CI/CD**: Recommend GitHub Actions or similar for lint, test, and deploy.

## Getting Started

1. `npm install`
2. Set up `.env` (see `.env.example`)
3. `npm start` or `npm run dev`
4. Run tests: `npm test`

## Folder Structure

- `src/controllers/` — HTTP layer
- `src/services/` — Business logic
- `src/models/` — Mongoose models
- `src/routes/` — Route definitions
- `src/middleware/` — Middleware (auth, error, logger, validation)
- `src/utils/` — Utilities (ApiError, etc.)
- `tests/` — Automated tests

## Production Readiness

- Use environment variables for secrets/config
- Enable HTTPS and secure cookies in production
- Use a process manager (PM2, Docker, etc.)
- Set up CI/CD for automated testing and deployment

---

For more details, see code comments and individual module documentation.
