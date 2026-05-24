import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication endpoints.
 * Strict limit: 10 requests per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.',
    code: 'RATE_LIMIT_AUTH',
  },
});

/**
 * Rate limiter for general API endpoints.
 * 100 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please slow down.',
    code: 'RATE_LIMIT_API',
  },
});

/**
 * Rate limiter for upload endpoints.
 * 20 uploads per 15 minutes per IP.
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many uploads. Please try again later.',
    code: 'RATE_LIMIT_UPLOAD',
  },
});
