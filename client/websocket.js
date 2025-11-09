// Simple wrapper to expose a global socket instance for the client.
// This file should be loaded after /socket.io/socket.io.js and before other client scripts.

(function () {
  // Prefer an explicitly set socket server URL (injected on the page) so
  // the static client hosted on Vercel can connect to an externally-hosted
  // Socket.IO server. If `window.SOCKET_SERVER_URL` is not set, fall back
  // to the same-origin socket endpoint.
  const serverUrl = window.SOCKET_SERVER_URL || undefined; // undefined -> same origin
  const socket = io(serverUrl);
  window.socket = socket;
})();
