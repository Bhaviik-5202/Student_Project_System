// Set safe defaults if core environment variables are not provided
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/student_projects_db';
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET =
    'dev-secret-key-student-project-management-system-2026';
}

// Provide defaults for Super Admin credentials
process.env.SUPER_ADMIN_EMAIL =
  process.env.SUPER_ADMIN_EMAIL ||
  process.env.ADMIN_EMAIL ||
  'er.bhavik5202@gmail.com';
process.env.SUPER_ADMIN_PASSWORD =
  process.env.SUPER_ADMIN_PASSWORD ||
  process.env.ADMIN_PASSWORD ||
  'Bhaviik@5202StuProject01';
process.env.ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
process.env.ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

// Provide defaults for others if missing (especially for tests/dev)
process.env.PORT = process.env.PORT || '5000';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (
  process.env.NODE_ENV === 'production' &&
  process.env.JWT_SECRET ===
    'dev-secret-key-student-project-management-system-2026'
) {
  throw new Error(
    'FATAL: A custom JWT_SECRET environment variable is required in production!'
  );
}
