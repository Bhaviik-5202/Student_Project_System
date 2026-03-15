const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

// Strictly check core secrets
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} is required`);
  }
});

// Provide defaults for others if missing (especially for tests/dev)
process.env.PORT = process.env.PORT || "5000";
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
process.env.NODE_ENV = process.env.NODE_ENV || "development";
