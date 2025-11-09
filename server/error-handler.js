/**
 * Express Error Handling Middleware for Vercel Errors
 */

const { getErrorInfo, createErrorResponse, isPlatformError } = require('./vercel-errors');

/**
 * Error handling middleware for Express
 * Handles Vercel-specific errors and general application errors
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    code: err.code,
    status: err.status || err.statusCode
  });

  // Check if it's a Vercel error code
  let errorCode = err.code || err.errorCode;
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'An error occurred';

  // If error has a Vercel error code, use it
  if (errorCode && getErrorInfo(errorCode)) {
    const errorInfo = getErrorInfo(errorCode);
    statusCode = errorInfo.status;
    message = err.message || errorInfo.description;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error: ' + message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized: ' + message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  }

  // Create error response
  const errorResponse = errorCode && getErrorInfo(errorCode)
    ? createErrorResponse(errorCode, message)
    : {
        error: {
          code: errorCode || 'INTERNAL_SERVER_ERROR',
          message: message,
          status: statusCode
        }
      };

  // Add platform error warning if applicable
  if (errorCode && isPlatformError(errorCode)) {
    errorResponse.error.platformError = true;
    errorResponse.error.supportMessage = 'This is a platform error. Please contact Vercel support.';
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res, next) {
  const errorResponse = createErrorResponse('NOT_FOUND', `Route ${req.method} ${req.path} not found`);
  res.status(404).json(errorResponse);
}

/**
 * Async error wrapper for route handlers
 * Wraps async route handlers to catch errors and pass them to error handler
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create a Vercel error
 * @param {string} errorCode - Vercel error code
 * @param {string} message - Custom error message
 * @returns {Error} Error object with code and status
 */
function createVercelError(errorCode, message) {
  const errorInfo = getErrorInfo(errorCode);
  const error = new Error(message || errorInfo?.description || 'Vercel error');
  error.code = errorCode;
  error.status = errorInfo?.status || 500;
  error.isVercelError = true;
  return error;
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  createVercelError
};

