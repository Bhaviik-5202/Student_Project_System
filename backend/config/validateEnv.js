// Set safe defaults if core environment variables are not provided
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/student_projects_db';
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET =
    'dev-secret-key-student-project-management-system-2026';
}

// Provide defaults for others if missing (especially for tests/dev)
process.env.PORT = process.env.PORT || '5000';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET === 'dev-secret-key-student-project-management-system-2026') {
  throw new Error('FATAL: A custom JWT_SECRET environment variable is required in production!');
}

