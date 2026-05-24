/**
 * Request logger middleware.
 * Logs method, path, status, and response time.
 * Never logs tokens, passwords, or secrets.
 */

const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function statusColor(code) {
  if (code >= 500) return COLORS.red;
  if (code >= 400) return COLORS.yellow;
  if (code >= 300) return COLORS.cyan;
  return COLORS.green;
}

export default function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = statusColor(status);

    const log = [
      `${COLORS.dim}${new Date().toISOString()}${COLORS.reset}`,
      `${COLORS.magenta}${req.method.padEnd(7)}${COLORS.reset}`,
      req.originalUrl,
      `${color}${status}${COLORS.reset}`,
      `${COLORS.dim}${duration}ms${COLORS.reset}`,
    ].join(' ');

    // Don't log health check spam
    if (req.originalUrl === '/' && req.method === 'GET') return;

    console.log(log);
  });

  next();
}

/**
 * Log auth events (login, logout, refresh).
 * Call explicitly from auth controller — do NOT log tokens.
 */
export function logAuthEvent(event, { email, ip, userAgent }) {
  const sanitized = {
    event,
    email: email || 'unknown',
    ip: ip || 'unknown',
    userAgent: userAgent ? userAgent.slice(0, 80) : 'unknown',
    timestamp: new Date().toISOString(),
  };
  console.log(`${COLORS.cyan}[AUTH]${COLORS.reset}`, JSON.stringify(sanitized));
}
