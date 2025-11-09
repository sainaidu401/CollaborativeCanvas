/**
 * Vercel Error Codes Utility
 * Maps Vercel error codes to their descriptions and HTTP status codes
 * Last updated: March 12, 2025
 */

const VERCEL_ERRORS = {
  // Application errors
  BODY_NOT_A_STRING_FROM_FUNCTION: {
    category: 'Function',
    status: 502,
    description: 'The function response body is not a string'
  },
  DEPLOYMENT_BLOCKED: {
    category: 'Deployment',
    status: 403,
    description: 'Deployment is blocked'
  },
  DEPLOYMENT_DELETED: {
    category: 'Deployment',
    status: 410,
    description: 'Deployment has been deleted'
  },
  DEPLOYMENT_DISABLED: {
    category: 'Deployment',
    status: 402,
    description: 'Deployment is disabled'
  },
  DEPLOYMENT_NOT_FOUND: {
    category: 'Deployment',
    status: 404,
    description: 'Deployment not found'
  },
  DEPLOYMENT_NOT_READY_REDIRECTING: {
    category: 'Deployment',
    status: 303,
    description: 'Deployment not ready, redirecting'
  },
  DEPLOYMENT_PAUSED: {
    category: 'Deployment',
    status: 503,
    description: 'Deployment is paused'
  },
  DNS_HOSTNAME_EMPTY: {
    category: 'DNS',
    status: 502,
    description: 'DNS hostname is empty'
  },
  DNS_HOSTNAME_NOT_FOUND: {
    category: 'DNS',
    status: 502,
    description: 'DNS hostname not found'
  },
  DNS_HOSTNAME_RESOLVE_FAILED: {
    category: 'DNS',
    status: 502,
    description: 'DNS hostname resolution failed'
  },
  DNS_HOSTNAME_RESOLVED_PRIVATE: {
    category: 'DNS',
    status: 404,
    description: 'DNS hostname resolved to private IP'
  },
  DNS_HOSTNAME_SERVER_ERROR: {
    category: 'DNS',
    status: 502,
    description: 'DNS server error'
  },
  EDGE_FUNCTION_INVOCATION_FAILED: {
    category: 'Function',
    status: 500,
    description: 'Edge function invocation failed'
  },
  EDGE_FUNCTION_INVOCATION_TIMEOUT: {
    category: 'Function',
    status: 504,
    description: 'Edge function invocation timeout'
  },
  FALLBACK_BODY_TOO_LARGE: {
    category: 'Cache',
    status: 502,
    description: 'Fallback body too large'
  },
  FUNCTION_INVOCATION_FAILED: {
    category: 'Function',
    status: 500,
    description: 'Function invocation failed'
  },
  FUNCTION_INVOCATION_TIMEOUT: {
    category: 'Function',
    status: 504,
    description: 'Function invocation timeout'
  },
  FUNCTION_PAYLOAD_TOO_LARGE: {
    category: 'Function',
    status: 413,
    description: 'Function payload too large'
  },
  FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE: {
    category: 'Function',
    status: 500,
    description: 'Function response payload too large'
  },
  FUNCTION_THROTTLED: {
    category: 'Function',
    status: 503,
    description: 'Function is throttled'
  },
  INFINITE_LOOP_DETECTED: {
    category: 'Runtime',
    status: 508,
    description: 'Infinite loop detected'
  },
  INVALID_IMAGE_OPTIMIZE_REQUEST: {
    category: 'Image',
    status: 400,
    description: 'Invalid image optimization request'
  },
  INVALID_REQUEST_METHOD: {
    category: 'Request',
    status: 405,
    description: 'Invalid request method'
  },
  MALFORMED_REQUEST_HEADER: {
    category: 'Request',
    status: 400,
    description: 'Malformed request header'
  },
  MICROFRONTENDS_MIDDLEWARE_ERROR: {
    category: 'Function',
    status: 500,
    description: 'Microfrontends middleware error'
  },
  MICROFRONTENDS_MISSING_FALLBACK_ERROR: {
    category: 'Function',
    status: 400,
    description: 'Microfrontends missing fallback error'
  },
  MIDDLEWARE_INVOCATION_FAILED: {
    category: 'Function',
    status: 500,
    description: 'Middleware invocation failed'
  },
  MIDDLEWARE_INVOCATION_TIMEOUT: {
    category: 'Function',
    status: 504,
    description: 'Middleware invocation timeout'
  },
  MIDDLEWARE_RUNTIME_DEPRECATED: {
    category: 'Runtime',
    status: 503,
    description: 'Middleware runtime deprecated'
  },
  NO_RESPONSE_FROM_FUNCTION: {
    category: 'Function',
    status: 502,
    description: 'No response from function'
  },
  NOT_FOUND: {
    category: 'Deployment',
    status: 404,
    description: 'Resource not found'
  },
  OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED: {
    category: 'Image',
    status: 502,
    description: 'Optimized external image request failed'
  },
  OPTIMIZED_EXTERNAL_IMAGE_REQUEST_INVALID: {
    category: 'Image',
    status: 502,
    description: 'Optimized external image request invalid'
  },
  OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED: {
    category: 'Image',
    status: 502,
    description: 'Optimized external image request unauthorized'
  },
  OPTIMIZED_EXTERNAL_IMAGE_TOO_MANY_REDIRECTS: {
    category: 'Image',
    status: 502,
    description: 'Optimized external image too many redirects'
  },
  RANGE_END_NOT_VALID: {
    category: 'Request',
    status: 416,
    description: 'Range end not valid'
  },
  RANGE_GROUP_NOT_VALID: {
    category: 'Request',
    status: 416,
    description: 'Range group not valid'
  },
  RANGE_MISSING_UNIT: {
    category: 'Request',
    status: 416,
    description: 'Range missing unit'
  },
  RANGE_START_NOT_VALID: {
    category: 'Request',
    status: 416,
    description: 'Range start not valid'
  },
  RANGE_UNIT_NOT_SUPPORTED: {
    category: 'Request',
    status: 416,
    description: 'Range unit not supported'
  },
  REQUEST_HEADER_TOO_LARGE: {
    category: 'Request',
    status: 431,
    description: 'Request header too large'
  },
  RESOURCE_NOT_FOUND: {
    category: 'Request',
    status: 404,
    description: 'Resource not found'
  },
  ROUTER_CANNOT_MATCH: {
    category: 'Routing',
    status: 502,
    description: 'Router cannot match route'
  },
  ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR: {
    category: 'Routing',
    status: 502,
    description: 'Router external target connection error'
  },
  ROUTER_EXTERNAL_TARGET_ERROR: {
    category: 'Routing',
    status: 502,
    description: 'Router external target error'
  },
  ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR: {
    category: 'Routing',
    status: 502,
    description: 'Router external target handshake error'
  },
  ROUTER_TOO_MANY_HAS_SELECTIONS: {
    category: 'Routing',
    status: 502,
    description: 'Router too many has selections'
  },
  SANDBOX_NOT_FOUND: {
    category: 'Sandbox',
    status: 404,
    description: 'Sandbox not found'
  },
  SANDBOX_NOT_LISTENING: {
    category: 'Sandbox',
    status: 502,
    description: 'Sandbox not listening'
  },
  SANDBOX_STOPPED: {
    category: 'Sandbox',
    status: 410,
    description: 'Sandbox stopped'
  },
  TOO_MANY_FILESYSTEM_CHECKS: {
    category: 'Routing',
    status: 502,
    description: 'Too many filesystem checks'
  },
  TOO_MANY_FORKS: {
    category: 'Routing',
    status: 502,
    description: 'Too many forks'
  },
  TOO_MANY_RANGES: {
    category: 'Request',
    status: 416,
    description: 'Too many ranges'
  },
  URL_TOO_LONG: {
    category: 'Request',
    status: 414,
    description: 'URL too long'
  }
};

// Platform errors (internal - contact Vercel support)
const PLATFORM_ERRORS = {
  FUNCTION_THROTTLED: {
    category: 'Internal',
    status: 500,
    description: 'Function throttled (internal)'
  },
  INTERNAL_CACHE_ERROR: {
    category: 'Internal',
    status: 500,
    description: 'Internal cache error'
  },
  INTERNAL_CACHE_KEY_TOO_LONG: {
    category: 'Internal',
    status: 500,
    description: 'Internal cache key too long'
  },
  INTERNAL_CACHE_LOCK_FULL: {
    category: 'Internal',
    status: 500,
    description: 'Internal cache lock full'
  },
  INTERNAL_CACHE_LOCK_TIMEOUT: {
    category: 'Internal',
    status: 500,
    description: 'Internal cache lock timeout'
  },
  INTERNAL_DEPLOYMENT_FETCH_FAILED: {
    category: 'Internal',
    status: 500,
    description: 'Internal deployment fetch failed'
  },
  INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED: {
    category: 'Internal',
    status: 500,
    description: 'Internal edge function invocation failed'
  },
  INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT: {
    category: 'Internal',
    status: 500,
    description: 'Internal edge function invocation timeout'
  },
  INTERNAL_FUNCTION_INVOCATION_FAILED: {
    category: 'Internal',
    status: 500,
    description: 'Internal function invocation failed'
  },
  INTERNAL_FUNCTION_INVOCATION_TIMEOUT: {
    category: 'Internal',
    status: 500,
    description: 'Internal function invocation timeout'
  },
  INTERNAL_FUNCTION_NOT_FOUND: {
    category: 'Internal',
    status: 500,
    description: 'Internal function not found'
  },
  INTERNAL_FUNCTION_NOT_READY: {
    category: 'Internal',
    status: 500,
    description: 'Internal function not ready'
  },
  INTERNAL_FUNCTION_SERVICE_UNAVAILABLE: {
    category: 'Internal',
    status: 500,
    description: 'Internal function service unavailable'
  },
  INTERNAL_MICROFRONTENDS_BUILD_ERROR: {
    category: 'Internal',
    status: 500,
    description: 'Internal microfrontends build error'
  },
  INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR: {
    category: 'Internal',
    status: 500,
    description: 'Internal microfrontends invalid configuration error'
  },
  INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR: {
    category: 'Internal',
    status: 500,
    description: 'Internal microfrontends unexpected error'
  },
  INTERNAL_MISSING_RESPONSE_FROM_CACHE: {
    category: 'Internal',
    status: 500,
    description: 'Internal missing response from cache'
  },
  INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED: {
    category: 'Internal',
    status: 500,
    description: 'Internal optimized image request failed'
  },
  INTERNAL_ROUTER_CANNOT_PARSE_PATH: {
    category: 'Internal',
    status: 500,
    description: 'Internal router cannot parse path'
  },
  INTERNAL_STATIC_REQUEST_FAILED: {
    category: 'Internal',
    status: 500,
    description: 'Internal static request failed'
  },
  INTERNAL_UNARCHIVE_FAILED: {
    category: 'Internal',
    status: 500,
    description: 'Internal unarchive failed'
  },
  INTERNAL_UNEXPECTED_ERROR: {
    category: 'Internal',
    status: 500,
    description: 'Internal unexpected error'
  }
};

/**
 * Get error information by error code
 * @param {string} errorCode - The Vercel error code
 * @returns {Object|null} Error information object or null if not found
 */
function getErrorInfo(errorCode) {
  return VERCEL_ERRORS[errorCode] || PLATFORM_ERRORS[errorCode] || null;
}

/**
 * Check if error code is a platform/internal error
 * @param {string} errorCode - The Vercel error code
 * @returns {boolean} True if platform error
 */
function isPlatformError(errorCode) {
  return PLATFORM_ERRORS.hasOwnProperty(errorCode);
}

/**
 * Get HTTP status code for error
 * @param {string} errorCode - The Vercel error code
 * @returns {number} HTTP status code or 500 if not found
 */
function getErrorStatus(errorCode) {
  const errorInfo = getErrorInfo(errorCode);
  return errorInfo ? errorInfo.status : 500;
}

/**
 * Create error response object
 * @param {string} errorCode - The Vercel error code
 * @param {string} [message] - Optional custom message
 * @returns {Object} Error response object
 */
function createErrorResponse(errorCode, message) {
  const errorInfo = getErrorInfo(errorCode);
  if (!errorInfo) {
    return {
      error: {
        code: 'UNKNOWN_ERROR',
        message: message || 'An unknown error occurred',
        status: 500
      }
    };
  }

  return {
    error: {
      code: errorCode,
      category: errorInfo.category,
      message: message || errorInfo.description,
      status: errorInfo.status,
      isPlatformError: isPlatformError(errorCode)
    }
  };
}

module.exports = {
  VERCEL_ERRORS,
  PLATFORM_ERRORS,
  getErrorInfo,
  isPlatformError,
  getErrorStatus,
  createErrorResponse
};

