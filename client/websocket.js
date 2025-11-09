// Simple wrapper to expose a global socket instance for the client.
// This file should be loaded after /socket.io/socket.io.js and before other client scripts.

(function () {
  // create socket and attach to window for other scripts to use
  const socket = io();
  window.socket = socket;
})();
