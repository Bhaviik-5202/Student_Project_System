module.exports = {
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/student_project_system",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  TOKEN_EXPIRES_IN: "7d",
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:5000/api/v1",
};
