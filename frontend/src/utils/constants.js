export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const ROLES = {
  ADMIN: "admin",
  FACULTY: "faculty",
  STUDENT: "student",
};

export const PROJECT_STATUS = {
  PLANNING: "planning",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  ON_HOLD: "on_hold",
  CANCELLED: "cancelled",
};

export const MEETING_TYPES = {
  TEAM: "team",
  PROJECT: "project",
  ONE_ON_ONE: "one_on_one",
  CLIENT: "client",
};

export const GRADE_LEVELS = {
  A_PLUS: "A+",
  A: "A",
  A_MINUS: "A-",
  B_PLUS: "B+",
  B: "B",
  B_MINUS: "B-",
  C_PLUS: "C+",
  C: "C",
  D: "D",
  F: "F",
};

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  STUDENTS: "/students",
  MEETINGS: "/meetings",
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: "authToken",
  USER: "user",
  USER_ROLE: "userRole",
  REFRESH_TOKEN: "refreshToken",
  THEME: "theme",
};

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const DATE_FORMATS = {
  DISPLAY: "MMM DD, YYYY",
  API: "YYYY-MM-DD",
  TIME: "hh:mm A",
};

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^[+]?[1-9][\d]{1,14}$/,
};
