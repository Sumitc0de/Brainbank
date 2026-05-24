import { isDevelopment } from '../config/env.js';

/**
 * Production-safe global error handler.
 * - Logs full error details server-side
 * - Returns sanitized errors to client
 * - Handles Mongoose-specific errors gracefully
 */
export default function errorHandler(err, req, res, _next) {
  // Already sent response
  if (res.headersSent) return;

  // ---- Determine status & message ----
  let status = err.status || err.statusCode || 500;
  let message = 'An unexpected error occurred.';
  let code = 'INTERNAL_ERROR';

  // Multer / upload errors
  if (err.name === 'MulterError') {
    status = 400;
    code = 'UPLOAD_ERROR';
    message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File is too large.'
      : `Upload error: ${err.message}`;
  } else if (err.message?.startsWith('Invalid ')) {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = err.message;
  }

  // Mongoose validation error
  else if (err.name === 'ValidationError') {
    status = 400;
    code = 'VALIDATION_ERROR';
    const fields = Object.values(err.errors || {}).map((e) => e.message);
    message = fields.length > 0 ? fields.join('. ') : 'Validation failed.';
  }

  // Mongoose cast error (invalid ObjectId etc.)
  else if (err.name === 'CastError') {
    status = 400;
    code = 'INVALID_ID';
    message = 'Invalid resource identifier.';
  }

  // Mongoose duplicate key
  else if (err.code === 11000) {
    status = 409;
    code = 'DUPLICATE_KEY';
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `Duplicate value for ${field}.`;
  }

  // JWT errors
  else if (err.name === 'TokenExpiredError') {
    status = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Session expired. Please log in again.';
  } else if (err.name === 'JsonWebTokenError') {
    status = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token.';
  }

  // Known application errors (thrown with explicit message)
  else if (status < 500) {
    message = err.message || message;
  }

  // ---- Log full error server-side ----
  if (status >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, {
      message: err.message,
      stack: err.stack,
      status,
    });
  }

  // ---- Send sanitized response ----
  const response = { success: false, error: message, code };

  // Only include stack in development for 500 errors
  if (isDevelopment() && status >= 500) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}
