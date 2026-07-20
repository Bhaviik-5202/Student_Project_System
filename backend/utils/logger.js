/**
 * Professional Logger Utility
 * ------------------------------------------------------------------
 * Provides a Winston-based logger with:
 *  - Colored, boxed console output (development)
 *  - File logging: app.log, error.log, http.log, auth.log
 *  - Environment-aware verbosity
 *  - Sensitive field scrubbing (passwords, tokens, secrets)
 *  - Helper methods: db(), auth(), success(), warn(), perf(), banner(), http()
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// ─── Ensure logs/ directory exists ───────────────────────────────────────────
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// ─── Environment ─────────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV !== 'production';
const isTest = process.env.NODE_ENV === 'test';

// ─── ANSI Color Codes ─────────────────────────────────────────────────────────
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Bright foreground
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DIVIDER = `${C.gray}${'━'.repeat(62)}${C.reset}`;
const BOX_TOP = `${C.gray}╔${'═'.repeat(60)}╗${C.reset}`;
const BOX_MID = `${C.gray}╠${'═'.repeat(60)}╣${C.reset}`;
const BOX_BOT = `${C.gray}╚${'═'.repeat(60)}╝${C.reset}`;

const pad = (label, value, color = C.white) =>
  `${C.gray}║${C.reset}  ${C.dim}${label.padEnd(14)}${C.reset}${C.gray}:${C.reset} ${color}${value}${C.reset}`;

const row = (label, value, color = C.brightWhite) =>
  `  ${C.dim}${C.cyan}${label.padEnd(12)}${C.reset} ${C.gray}:${C.reset} ${color}${value}${C.reset}`;

/**
 * Scrub sensitive fields from objects before logging.
 * Operates recursively; never modifies the original object.
 */
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'resetToken',
  'jwtSecret',
  'secret',
  'authorization',
  'Authorization',
  'otp',
  'pin',
  'cvv',
]);

function scrub(obj, depth = 0) {
  if (depth > 5 || typeof obj !== 'object' || obj === null) return obj;
  const out = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(k)) {
      out[k] = '[REDACTED]';
    } else if (typeof v === 'object') {
      out[k] = scrub(v, depth + 1);
    } else {
      out[k] = v;
    }
  }
  return out;
}

// ─── Winston File Transports (always JSON) ───────────────────────────────────
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const winstonLogger = winston.createLogger({
  level: isDev ? 'debug' : 'warn',
  silent: isTest,
  transports: [
    // All logs
    new winston.transports.File({
      filename: path.join(logsDir, 'app.log'),
      format: fileFormat,
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
    }),
    // Errors only
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

// Separate transport instances for http and auth logs
const httpFileTransport = new winston.transports.File({
  filename: path.join(logsDir, 'http.log'),
  format: fileFormat,
  maxsize: 5 * 1024 * 1024,
  maxFiles: 5,
});

const authFileTransport = new winston.transports.File({
  filename: path.join(logsDir, 'auth.log'),
  format: fileFormat,
  maxsize: 5 * 1024 * 1024,
  maxFiles: 5,
});

// ─── Timestamp Helper ─────────────────────────────────────────────────────────
function now() {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

// ─── Method / Status Colors ───────────────────────────────────────────────────
function methodColor(method) {
  switch (method) {
    case 'GET':
      return C.brightGreen;
    case 'POST':
      return C.brightBlue;
    case 'PUT':
      return C.brightYellow;
    case 'PATCH':
      return C.brightCyan;
    case 'DELETE':
      return C.brightRed;
    default:
      return C.white;
  }
}

function statusColor(status) {
  if (status >= 500) return C.brightRed;
  if (status >= 400) return C.brightYellow;
  if (status >= 300) return C.brightBlue;
  return C.brightGreen;
}

function statusText(status) {
  const map = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    301: 'Moved Permanently',
    302: 'Found',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
  };
  return map[status] || '';
}

// ─── Public Logger API ────────────────────────────────────────────────────────
const logger = {
  /**
   * Log an incoming HTTP request in boxed format.
   * @param {{ method, route, status, duration, size, ip }} info
   */
  http({ method, route, status, duration, size, ip }) {
    if (isTest) return;

    const sc = statusColor(status);
    const mc = methodColor(method);
    const st = statusText(status);

    const durationNum = parseFloat(duration);
    const durationColor = durationNum > 2000 ? C.brightRed : durationNum > 500 ? C.brightYellow : C.brightGreen;

    const lines = [
      DIVIDER,
      `${C.brightBlue}${C.bold}  🌐 HTTP REQUEST${C.reset}`,
      DIVIDER,
      row('Method', `${mc}${method}${C.reset}`, ''),
      row('Route', route, C.brightWhite),
      row('Status', `${sc}${status} ${st}${C.reset}`, ''),
      row('Duration', `${durationColor}${duration} ms${C.reset}`, ''),
      row('Response', size ? `${size} Bytes` : '-', C.gray),
      row('IP Address', ip || '-', C.gray),
      row('Time', now(), C.gray),
      DIVIDER,
    ];

    // Only print all details in dev; in production print only 4xx/5xx
    if (isDev || status >= 400) {
      console.log(lines.join('\n'));
    }

    // Always write to file
    winstonLogger.info(
      { type: 'http', method, route, status, duration, size, ip },
      'HTTP'
    );
    httpFileTransport.log &&
      httpFileTransport.log(
        {
          level: status >= 400 ? 'warn' : 'info',
          message: 'HTTP',
          type: 'http',
          method,
          route,
          status,
          duration,
          size,
          ip,
          timestamp: new Date().toISOString(),
        },
        () => {}
      );
  },

  /**
   * Log an auth event (login, register, logout, failed attempts).
   * @param {{ event, name, email, role, ip, status }} info
   */
  auth({ event, name, email, role, ip, status = 'SUCCESS' }) {
    if (isTest) return;

    const isSuccess = status === 'SUCCESS';
    const color = isSuccess ? C.brightGreen : C.brightRed;
    const icon = isSuccess ? '✅' : '❌';

    const lines = [
      DIVIDER,
      `${C.brightMagenta}${C.bold}  🔐 AUTH EVENT${C.reset}`,
      DIVIDER,
      row('Event', `${color}${event}${C.reset}`, ''),
      row('Status', `${color}${icon} ${status}${C.reset}`, ''),
      ...(name ? [row('Name', name, C.brightWhite)] : []),
      ...(email ? [row('Email', email, C.cyan)] : []),
      ...(role ? [row('Role', role, C.yellow)] : []),
      row('IP', ip || '-', C.gray),
      row('Time', now(), C.gray),
      DIVIDER,
    ];

    console.log(lines.join('\n'));

    const level = isSuccess ? 'info' : 'warn';
    winstonLogger[level]({ type: 'auth', event, name, email, role, ip, status }, 'AUTH');
    authFileTransport.log &&
      authFileTransport.log(
        {
          level,
          message: 'AUTH',
          type: 'auth',
          event,
          name,
          email,
          role,
          ip,
          status,
          timestamp: new Date().toISOString(),
        },
        () => {}
      );
  },

  /**
   * Log a successful operation.
   * @param {string} message
   * @param {Object} [meta]
   */
  success(message, meta = {}) {
    if (isTest) return;

    const cleanMeta = scrub(meta);
    const metaLine =
      Object.keys(cleanMeta).length > 0
        ? `\n  ${C.dim}${C.gray}${JSON.stringify(cleanMeta)}${C.reset}`
        : '';

    if (isDev) {
      console.log(
        `${C.brightGreen}  ✅ SUCCESS${C.reset}  ${C.gray}→${C.reset}  ${C.brightWhite}${message}${C.reset}${metaLine}`
      );
    }

    winstonLogger.info({ type: 'success', message, ...cleanMeta }, message);
  },

  /**
   * Log an informational message.
   * @param {string} message
   * @param {Object} [meta]
   */
  info(message, meta = {}) {
    if (isTest) return;
    const cleanMeta = scrub(meta);
    if (isDev) {
      console.log(
        `${C.brightCyan}  ℹ️  INFO${C.reset}     ${C.gray}→${C.reset}  ${C.white}${message}${C.reset}`
      );
    }
    winstonLogger.info({ type: 'info', message, ...cleanMeta }, message);
  },

  /**
   * Log a warning.
   * @param {string} message
   * @param {Object} [meta]
   */
  warn(message, meta = {}) {
    if (isTest) return;
    const cleanMeta = scrub(meta);
    const metaLine =
      Object.keys(cleanMeta).length > 0
        ? `\n  ${C.dim}${C.gray}${JSON.stringify(cleanMeta)}${C.reset}`
        : '';
    console.log(
      `${C.brightYellow}  ⚠️  WARNING${C.reset}  ${C.gray}→${C.reset}  ${C.yellow}${message}${C.reset}${metaLine}`
    );
    winstonLogger.warn({ type: 'warn', message, ...cleanMeta }, message);
  },

  /**
   * Log an error with optional stack trace (dev only).
   * @param {string} message
   * @param {Object} [meta]
   */
  error(message, meta = {}) {
    if (isTest) return;
    const cleanMeta = scrub(meta);
    const { err, route, status } = cleanMeta;

    const lines = [
      DIVIDER,
      `${C.brightRed}${C.bold}  ❌ API ERROR${C.reset}`,
      DIVIDER,
      ...(route ? [row('Route', route, C.brightWhite)] : []),
      ...(status ? [row('Status', String(status), statusColor(status))] : []),
      row('Error', message, C.brightRed),
      row('Time', now(), C.gray),
      ...(isDev && err?.stack ? [row('Stack', '\n' + err.stack, C.gray)] : []),
      DIVIDER,
    ];

    console.error(lines.join('\n'));
    winstonLogger.error({ type: 'error', message, ...cleanMeta }, message);
  },

  /**
   * Log database connection status in a boxed format.
   * @param {{ status, dbName, collections, users, projects }} info
   */
  db({ status, dbName, collections, users, projects }) {
    if (isTest) return;

    const isOk = status === 'connected';
    const statusColor2 = isOk ? C.brightGreen : C.brightRed;
    const statusIcon = isOk ? '✅ Connected' : '❌ Disconnected';

    const lines = [
      BOX_TOP,
      `${C.gray}║${C.reset}${C.bold}${C.brightCyan}${'         🗄️  DATABASE CONNECTION'.padEnd(60)}${C.reset}${C.gray}║${C.reset}`,
      BOX_MID,
      pad('Status', statusIcon, statusColor2),
      pad('Database', dbName || '-', C.brightWhite),
      pad('Collections', String(collections ?? '-'), C.brightWhite),
      pad('Users', String(users ?? '-'), C.brightYellow),
      pad('Projects', String(projects ?? '-'), C.brightBlue),
      BOX_BOT,
    ];

    console.log('\n' + lines.join('\n'));
    winstonLogger.info(
      { type: 'db', status, dbName, collections, users, projects },
      'DB Connection'
    );
  },

  /**
   * Log a slow API performance warning.
   * @param {{ route, method, duration }} info
   */
  perf({ route, method, duration }) {
    if (isTest) return;

    console.log(
      `${C.brightYellow}  🐌 SLOW REQUEST${C.reset}  ${C.gray}→${C.reset}  ${methodColor(method)}${method}${C.reset} ${C.brightWhite}${route}${C.reset} ${C.gray}took${C.reset} ${C.brightRed}${duration} ms${C.reset}  ${C.dim}${C.gray}(threshold: 2000ms)${C.reset}`
    );

    winstonLogger.warn(
      { type: 'perf', route, method, duration },
      `Slow request: ${method} ${route} (${duration}ms)`
    );
  },

  /**
   * Print the server startup banner after DB is ready.
   * @param {{ port, env, dbStatus, startedAt }} info
   */
  banner({ port, env, dbStatus, startedAt }) {
    if (isTest) return;

    const envColor = env === 'production' ? C.brightRed : C.brightGreen;
    const dbColor = dbStatus === 'Connected' ? C.brightGreen : C.brightRed;

    const lines = [
      '',
      BOX_TOP,
      `${C.gray}║${C.reset}${C.bold}${C.brightMagenta}${'      🎓 STUDENT PROJECT SYSTEM API'.padEnd(60)}${C.reset}${C.gray}║${C.reset}`,
      BOX_MID,
      pad('Status', '✅ Running', C.brightGreen),
      pad('URL', `http://localhost:${port}`, C.brightCyan),
      pad('Environment', env, envColor),
      pad('DB Status', dbStatus, dbColor),
      pad('Started', startedAt || now(), C.gray),
      BOX_BOT,
      '',
    ];

    console.log(lines.join('\n'));
    winstonLogger.info(
      { type: 'startup', port, env, dbStatus, startedAt },
      'Server started'
    );
  },
};

module.exports = logger;
