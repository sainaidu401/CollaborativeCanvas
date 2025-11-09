# Vercel Error Codes Reference

Last updated: March 12, 2025

This document provides a reference for Vercel error codes that may be encountered when developing and deploying applications on Vercel. The error handling system in this project includes utilities to handle these errors gracefully.

## Table of Contents

- [Application Errors](#application-errors)
- [Platform Errors](#platform-errors)
- [Error Handling in This Project](#error-handling-in-this-project)
- [Usage Examples](#usage-examples)

## Application Errors

These errors can occur during normal application operation and should be handled by your application code.

### Deployment Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `DEPLOYMENT_BLOCKED` | 403 | Deployment is blocked |
| `DEPLOYMENT_DELETED` | 410 | Deployment has been deleted |
| `DEPLOYMENT_DISABLED` | 402 | Deployment is disabled |
| `DEPLOYMENT_NOT_FOUND` | 404 | Deployment not found |
| `DEPLOYMENT_NOT_READY_REDIRECTING` | 303 | Deployment not ready, redirecting |
| `DEPLOYMENT_PAUSED` | 503 | Deployment is paused |
| `NOT_FOUND` | 404 | Resource not found |

### Function Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `BODY_NOT_A_STRING_FROM_FUNCTION` | 502 | The function response body is not a string |
| `EDGE_FUNCTION_INVOCATION_FAILED` | 500 | Edge function invocation failed |
| `EDGE_FUNCTION_INVOCATION_TIMEOUT` | 504 | Edge function invocation timeout |
| `FUNCTION_INVOCATION_FAILED` | 500 | Function invocation failed |
| `FUNCTION_INVOCATION_TIMEOUT` | 504 | Function invocation timeout |
| `FUNCTION_PAYLOAD_TOO_LARGE` | 413 | Function payload too large |
| `FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE` | 500 | Function response payload too large |
| `FUNCTION_THROTTLED` | 503 | Function is throttled |
| `NO_RESPONSE_FROM_FUNCTION` | 502 | No response from function |

### Middleware Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `MICROFRONTENDS_MIDDLEWARE_ERROR` | 500 | Microfrontends middleware error |
| `MICROFRONTENDS_MISSING_FALLBACK_ERROR` | 400 | Microfrontends missing fallback error |
| `MIDDLEWARE_INVOCATION_FAILED` | 500 | Middleware invocation failed |
| `MIDDLEWARE_INVOCATION_TIMEOUT` | 504 | Middleware invocation timeout |
| `MIDDLEWARE_RUNTIME_DEPRECATED` | 503 | Middleware runtime deprecated |

### DNS Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `DNS_HOSTNAME_EMPTY` | 502 | DNS hostname is empty |
| `DNS_HOSTNAME_NOT_FOUND` | 502 | DNS hostname not found |
| `DNS_HOSTNAME_RESOLVE_FAILED` | 502 | DNS hostname resolution failed |
| `DNS_HOSTNAME_RESOLVED_PRIVATE` | 404 | DNS hostname resolved to private IP |
| `DNS_HOSTNAME_SERVER_ERROR` | 502 | DNS server error |

### Image Optimization Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_IMAGE_OPTIMIZE_REQUEST` | 400 | Invalid image optimization request |
| `OPTIMIZED_EXTERNAL_IMAGE_REQUEST_FAILED` | 502 | Optimized external image request failed |
| `OPTIMIZED_EXTERNAL_IMAGE_REQUEST_INVALID` | 502 | Optimized external image request invalid |
| `OPTIMIZED_EXTERNAL_IMAGE_REQUEST_UNAUTHORIZED` | 502 | Optimized external image request unauthorized |
| `OPTIMIZED_EXTERNAL_IMAGE_TOO_MANY_REDIRECTS` | 502 | Optimized external image too many redirects |

### Request Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_REQUEST_METHOD` | 405 | Invalid request method |
| `MALFORMED_REQUEST_HEADER` | 400 | Malformed request header |
| `REQUEST_HEADER_TOO_LARGE` | 431 | Request header too large |
| `RESOURCE_NOT_FOUND` | 404 | Resource not found |
| `URL_TOO_LONG` | 414 | URL too long |

### Range Request Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `RANGE_END_NOT_VALID` | 416 | Range end not valid |
| `RANGE_GROUP_NOT_VALID` | 416 | Range group not valid |
| `RANGE_MISSING_UNIT` | 416 | Range missing unit |
| `RANGE_START_NOT_VALID` | 416 | Range start not valid |
| `RANGE_UNIT_NOT_SUPPORTED` | 416 | Range unit not supported |
| `TOO_MANY_RANGES` | 416 | Too many ranges |

### Routing Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `ROUTER_CANNOT_MATCH` | 502 | Router cannot match route |
| `ROUTER_EXTERNAL_TARGET_CONNECTION_ERROR` | 502 | Router external target connection error |
| `ROUTER_EXTERNAL_TARGET_ERROR` | 502 | Router external target error |
| `ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR` | 502 | Router external target handshake error |
| `ROUTER_TOO_MANY_HAS_SELECTIONS` | 502 | Router too many has selections |
| `TOO_MANY_FILESYSTEM_CHECKS` | 502 | Too many filesystem checks |
| `TOO_MANY_FORKS` | 502 | Too many forks |

### Runtime Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INFINITE_LOOP_DETECTED` | 508 | Infinite loop detected |

### Cache Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FALLBACK_BODY_TOO_LARGE` | 502 | Fallback body too large |

### Sandbox Errors

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `SANDBOX_NOT_FOUND` | 404 | Sandbox not found |
| `SANDBOX_NOT_LISTENING` | 502 | Sandbox not listening |
| `SANDBOX_STOPPED` | 410 | Sandbox stopped |

## Platform Errors

These errors are related to the Vercel platform itself. If you encounter one of these errors, contact Vercel support.

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `FUNCTION_THROTTLED` | 500 | Function throttled (internal) |
| `INTERNAL_CACHE_ERROR` | 500 | Internal cache error |
| `INTERNAL_CACHE_KEY_TOO_LONG` | 500 | Internal cache key too long |
| `INTERNAL_CACHE_LOCK_FULL` | 500 | Internal cache lock full |
| `INTERNAL_CACHE_LOCK_TIMEOUT` | 500 | Internal cache lock timeout |
| `INTERNAL_DEPLOYMENT_FETCH_FAILED` | 500 | Internal deployment fetch failed |
| `INTERNAL_EDGE_FUNCTION_INVOCATION_FAILED` | 500 | Internal edge function invocation failed |
| `INTERNAL_EDGE_FUNCTION_INVOCATION_TIMEOUT` | 500 | Internal edge function invocation timeout |
| `INTERNAL_FUNCTION_INVOCATION_FAILED` | 500 | Internal function invocation failed |
| `INTERNAL_FUNCTION_INVOCATION_TIMEOUT` | 500 | Internal function invocation timeout |
| `INTERNAL_FUNCTION_NOT_FOUND` | 500 | Internal function not found |
| `INTERNAL_FUNCTION_NOT_READY` | 500 | Internal function not ready |
| `INTERNAL_FUNCTION_SERVICE_UNAVAILABLE` | 500 | Internal function service unavailable |
| `INTERNAL_MICROFRONTENDS_BUILD_ERROR` | 500 | Internal microfrontends build error |
| `INTERNAL_MICROFRONTENDS_INVALID_CONFIGURATION_ERROR` | 500 | Internal microfrontends invalid configuration error |
| `INTERNAL_MICROFRONTENDS_UNEXPECTED_ERROR` | 500 | Internal microfrontends unexpected error |
| `INTERNAL_MISSING_RESPONSE_FROM_CACHE` | 500 | Internal missing response from cache |
| `INTERNAL_OPTIMIZED_IMAGE_REQUEST_FAILED` | 500 | Internal optimized image request failed |
| `INTERNAL_ROUTER_CANNOT_PARSE_PATH` | 500 | Internal router cannot parse path |
| `INTERNAL_STATIC_REQUEST_FAILED` | 500 | Internal static request failed |
| `INTERNAL_UNARCHIVE_FAILED` | 500 | Internal unarchive failed |
| `INTERNAL_UNEXPECTED_ERROR` | 500 | Internal unexpected error |

## Error Handling in This Project

This project includes comprehensive error handling for Vercel errors:

### Server-Side Error Handling

- **`server/vercel-errors.js`**: Utility module that maps all Vercel error codes to their descriptions and HTTP status codes
- **`server/error-handler.js`**: Express middleware for handling errors and creating standardized error responses
- **`server/server.js`**: Updated to include error handling middleware

### Client-Side Error Handling

- **`client/error-handler.js`**: Client-side error handler that:
  - Displays user-friendly error messages
  - Handles WebSocket connection errors
  - Handles fetch API errors
  - Provides global error handling for unhandled errors

### Features

1. **Automatic Error Detection**: Errors are automatically detected and mapped to Vercel error codes
2. **User-Friendly Messages**: Client-side errors are displayed in a user-friendly format
3. **Platform Error Detection**: Platform errors are identified and users are directed to contact Vercel support
4. **WebSocket Error Handling**: Special handling for WebSocket connection errors
5. **Standardized Responses**: All errors return a consistent JSON format

## Usage Examples

### Server-Side: Creating a Vercel Error

```javascript
const { createVercelError } = require('./server/error-handler');

// In a route handler
app.get('/api/data', (req, res, next) => {
  if (!data) {
    return next(createVercelError('RESOURCE_NOT_FOUND', 'Data not found'));
  }
  res.json(data);
});
```

### Server-Side: Using Async Handler

```javascript
const { asyncHandler } = require('./server/error-handler');

app.get('/api/data', asyncHandler(async (req, res) => {
  const data = await fetchData();
  res.json(data);
}));
```

### Client-Side: Handling Fetch Errors

```javascript
// The error handler is automatically included and will handle fetch errors
fetch('/api/data')
  .then(response => handleFetchError(response))
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Client-Side: Showing Custom Errors

```javascript
// If error-handler.js is loaded
if (typeof showError !== 'undefined') {
  showError('FUNCTION_INVOCATION_FAILED', 'Custom error message');
}
```

## Error Response Format

All errors return a standardized JSON format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "category": "Function|Deployment|DNS|...",
    "message": "Error description",
    "status": 500,
    "isPlatformError": false
  }
}
```

For platform errors, an additional field is included:

```json
{
  "error": {
    "code": "INTERNAL_UNEXPECTED_ERROR",
    "category": "Internal",
    "message": "Internal unexpected error",
    "status": 500,
    "isPlatformError": true,
    "platformError": true,
    "supportMessage": "This is a platform error. Please contact Vercel support."
  }
}
```

## References

- [Vercel Error Codes Documentation](https://vercel.com/docs/errors)
- [Vercel Support](https://vercel.com/support)

