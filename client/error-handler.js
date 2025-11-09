/**
 * Client-side Error Handler for Vercel Deployment Errors
 * Handles common Vercel errors and displays user-friendly messages
 */

// Common Vercel error codes that can occur on the client side
const CLIENT_ERROR_MESSAGES = {
  'DEPLOYMENT_NOT_FOUND': 'The deployment was not found. Please check the URL.',
  'DEPLOYMENT_DELETED': 'This deployment has been deleted.',
  'DEPLOYMENT_DISABLED': 'This deployment is currently disabled.',
  'DEPLOYMENT_PAUSED': 'This deployment is paused. Please try again later.',
  'NOT_FOUND': 'The requested resource was not found.',
  'RESOURCE_NOT_FOUND': 'The requested resource was not found.',
  'FUNCTION_INVOCATION_FAILED': 'A server function failed. Please try again.',
  'FUNCTION_INVOCATION_TIMEOUT': 'The request timed out. Please try again.',
  'FUNCTION_THROTTLED': 'Too many requests. Please wait a moment and try again.',
  'NO_RESPONSE_FROM_FUNCTION': 'No response from server. Please check your connection.',
  'ROUTER_CANNOT_MATCH': 'Unable to route request. Please check the URL.',
  'SANDBOX_NOT_FOUND': 'Development environment not found.',
  'SANDBOX_STOPPED': 'Development environment has stopped.',
  'DNS_HOSTNAME_NOT_FOUND': 'Unable to resolve hostname. Please check your connection.',
  'DNS_HOSTNAME_RESOLVE_FAILED': 'DNS resolution failed. Please check your connection.',
  'REQUEST_HEADER_TOO_LARGE': 'Request is too large. Please reduce the data size.',
  'URL_TOO_LONG': 'The URL is too long. Please use a shorter URL.',
  'FUNCTION_PAYLOAD_TOO_LARGE': 'The data being sent is too large. Please reduce the size.',
  'FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE': 'Server response is too large.',
  'INVALID_REQUEST_METHOD': 'Invalid request method.',
  'MALFORMED_REQUEST_HEADER': 'Invalid request format.',
  'RANGE_START_NOT_VALID': 'Invalid range request.',
  'RANGE_END_NOT_VALID': 'Invalid range request.',
  'RANGE_UNIT_NOT_SUPPORTED': 'Range unit not supported.',
  'TOO_MANY_RANGES': 'Too many range requests.',
  'INFINITE_LOOP_DETECTED': 'An infinite loop was detected. Please refresh the page.',
  'EDGE_FUNCTION_INVOCATION_FAILED': 'Edge function failed. Please try again.',
  'EDGE_FUNCTION_INVOCATION_TIMEOUT': 'Edge function timed out. Please try again.',
  'MIDDLEWARE_INVOCATION_FAILED': 'Middleware failed. Please try again.',
  'MIDDLEWARE_INVOCATION_TIMEOUT': 'Middleware timed out. Please try again.',
  'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED': 'Image optimization failed.',
  'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_INVALID': 'Invalid image request.',
  'OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED': 'Image request unauthorized.',
  'OPTIMIZED_EXTERNAL_IMAGE_TOO_MANY_REDIRECTS': 'Too many redirects for image.',
  'INVALID_IMAGE_OPTIMIZE_REQUEST': 'Invalid image optimization request.'
};

/**
 * Display error message to user
 * @param {string} errorCode - Vercel error code
 * @param {string} customMessage - Optional custom message
 */
function showError(errorCode, customMessage) {
  const message = customMessage || CLIENT_ERROR_MESSAGES[errorCode] || 'An error occurred. Please try again.';
  
  // Create or get error display element
  let errorEl = document.getElementById('vercel-error-display');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.id = 'vercel-error-display';
    errorEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
    `;
    document.body.appendChild(errorEl);
  }

  // Add close button if not present
  if (!errorEl.querySelector('.error-close')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'error-close';
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 5px;
      right: 10px;
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      line-height: 1;
      padding: 0;
      width: 24px;
      height: 24px;
    `;
    closeBtn.onclick = () => errorEl.remove();
    errorEl.appendChild(closeBtn);
  }

  // Set message
  const messageEl = errorEl.querySelector('.error-message') || document.createElement('div');
  messageEl.className = 'error-message';
  messageEl.textContent = message;
  if (!errorEl.querySelector('.error-message')) {
    errorEl.insertBefore(messageEl, errorEl.querySelector('.error-close'));
  }

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (errorEl && errorEl.parentNode) {
      errorEl.remove();
    }
  }, 10000);
}

/**
 * Handle fetch errors
 * @param {Response} response - Fetch response object
 * @returns {Promise<Response>} Response or throws error
 */
async function handleFetchError(response) {
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch (e) {
      // If response is not JSON, create error from status
      errorData = {
        error: {
          code: `HTTP_${response.status}`,
          message: response.statusText || 'Request failed',
          status: response.status
        }
      };
    }

    if (errorData && errorData.error) {
      const errorCode = errorData.error.code;
      showError(errorCode, errorData.error.message);
      throw new Error(errorData.error.message || 'Request failed');
    } else {
      showError(null, `Request failed with status ${response.status}`);
      throw new Error(`Request failed: ${response.status}`);
    }
  }
  return response;
}

/**
 * Handle WebSocket errors
 */
function setupWebSocketErrorHandling() {
  if (typeof window !== 'undefined' && window.socket) {
    const socket = window.socket;

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      showError('NO_RESPONSE_FROM_FUNCTION', 'Unable to connect to server. Please check your connection.');
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // Server disconnected the socket, try to reconnect
        socket.connect();
      } else if (reason === 'transport close') {
        showError('NO_RESPONSE_FROM_FUNCTION', 'Connection lost. Attempting to reconnect...');
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      if (error.code) {
        showError(error.code, error.message);
      } else {
        showError(null, 'WebSocket error occurred');
      }
    });
  }
}

/**
 * Handle unhandled errors
 */
function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (event.reason && event.reason.code) {
      showError(event.reason.code, event.reason.message);
    } else {
      showError(null, 'An unexpected error occurred');
    }
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Don't show error for script loading errors
    if (event.error && event.error.code) {
      showError(event.error.code, event.error.message);
    }
  });
}

// Initialize error handling when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupGlobalErrorHandling();
    setupWebSocketErrorHandling();
  });
} else {
  setupGlobalErrorHandling();
  setupWebSocketErrorHandling();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showError,
    handleFetchError,
    setupWebSocketErrorHandling,
    setupGlobalErrorHandling,
    CLIENT_ERROR_MESSAGES
  };
}

