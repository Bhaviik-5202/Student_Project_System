# Project Structure

- config/         # Database and Swagger config
- controllers/    # Express route controllers
- middleware/     # Express middleware (auth, error, logger, etc.)
- models/         # Mongoose models
- repositories/   # Data access layer
- routes/         # Express route definitions
- services/       # Business logic
- tests/          # Mocha/Chai/Supertest tests
- utils/          # Utility functions (response, jwt, email, etc.)
- uploads/        # Uploaded files (multer)

# Root Files
- .env            # Environment variables
- .gitignore      # Git ignore rules
- jest.config.js  # Jest config (if using Jest)
- package.json    # NPM dependencies and scripts
- README.md       # Project documentation
- server.js       # App entry point
- thunder-collection.json # Thunder Client API tests
