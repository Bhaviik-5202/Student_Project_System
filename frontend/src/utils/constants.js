const rawApiUrl = import.meta.env.VITE_API_URL || '/api/v1';
export const API_BASE_URL =
  rawApiUrl.startsWith('http') && !rawApiUrl.includes('/api/v1')
    ? `${rawApiUrl.replace(/\/$/, '')}/api/v1`
    : rawApiUrl;

export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
};

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled',
};

export const MEETING_TYPES = {
  TEAM: 'team',
  PROJECT: 'project',
  ONE_ON_ONE: 'one_on_one',
  CLIENT: 'client',
};

export const GRADE_LEVELS = {
  A_PLUS: 'A+',
  A: 'A',
  A_MINUS: 'A-',
  B_PLUS: 'B+',
  B: 'B',
  B_MINUS: 'B-',
  C_PLUS: 'C+',
  C: 'C',
  D: 'D',
  F: 'F',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  STUDENTS: '/students',
  MEETINGS: '/meetings',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER: 'user',
  USER_ROLE: 'userRole',
  REFRESH_TOKEN: 'refreshToken',
  THEME: 'theme',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  TIME: 'hh:mm A',
};

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^[+]?[1-9][\d]{1,14}$/,
};

export const CONTACT_INFO = {
  EMAIL: 'er.bhavik5202@gmail.com',
  PHONE: '+91 6353712057',
  ADDRESS: 'Dwarka, Gujarat, India',
  SOCIALS: {
    GITHUB: 'https://github.com/Bhaviik-5202',
    LINKEDIN: 'https://www.linkedin.com/in/bhavik-parmar-51baa1303/',
    TWITTER: 'https://twitter.com',
  },
};
