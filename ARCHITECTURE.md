ARCHITECTURE

Overview

This app follows a simple server-driven synchronization model using Socket.IO.

Client

- `index.html` - main page
- `style.css` - styles
- `websocket.js` - creates a global `window.socket` object (socket.io client)
- `canvas.js` - drawing logic; emits `start` and `draw` events and listens for remote events

Server

- `server.js` - Express static server + Socket.IO handlers
- `rooms.js` - lightweight room membership helper (can be expanded)
- `drawing-state.js` - stores strokes (each stroke is an array of events). Exposes add/clear/undo/getHistory.

Data model

- Events:
  - `{ type: 'start', x, y, color, stroke }` - start of a stroke
  - `{ type: 'draw', x, y, color, stroke }` - subsequent points in the stroke

Synchronization

- Realtime: client emits `start` then many `draw` events; server broadcasts to other clients immediately.
- Replay: clients can ask for `requestInit` to receive the full history as a flat event list; client replays events to reconstruct the canvas.

Undo/Redo

- The server stores strokes as arrays; `undo` removes the last stroke. Redo is not yet implemented.

Scaling considerations

- The server stores all history in memory — for many users or long sessions persist to DB and cap history size.
- Use throttling on the client to reduce event volume (e.g. sample pointer at ~20ms intervals).
- For large-scale collaborative editing, consider CRDTs or operational transforms. For free-hand drawing, stroke-level operations usually suffice.

Security

- Validate incoming events server-side to avoid malformed data.
- Add rate limiting and authentication for public deployments.
