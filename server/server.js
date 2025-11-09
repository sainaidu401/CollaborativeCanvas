const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from client folder
app.use(express.static(path.join(__dirname, '../client')));

// Store drawing history using drawing-state module (stroke grouping)
const drawingState = require('./drawing-state');
let seqCounter = 0; // server-assigned sequence for strokes
const strokeSeqById = new Map();
let users = {};

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Lightweight user metadata: a display color so clients can paint cursors/labels
  const userColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
  users[socket.id] = { color: userColor };
  io.emit('userList', users);

  // Send current drawing state immediately so the new client can replay
  // existing strokes. The client will group events by strokeId and re-render.
  socket.emit('initCanvas', drawingState.getHistoryFlat());

  // Broadcast drawing events and store them as typed events in strokes
  socket.on('start', (data) => {
    // Assign a global sequence number to the stroke for deterministic replay.
    // This lightweight seq helps clients replay strokes in a consistent order.
    try {
      const seq = ++seqCounter;
      if (data.strokeId) strokeSeqById.set(data.strokeId, seq);
      const ev = Object.assign({ type: 'start', seq }, data);
      drawingState.addEvent(ev);
      // Broadcast the start to other clients including the sender id and seq.
      socket.broadcast.emit('start', Object.assign({ id: socket.id, seq }, data));
    } catch (err) {
      // Log and continue; we don't want a single malformed start to crash the server.
      console.error('Error handling start event', err);
    }
  });

  socket.on('draw', (data) => {
    // Attach the parent stroke seq if available. Store the draw event and
    // broadcast to other clients so they can render live segments.
    try {
      const seq = data.strokeId ? strokeSeqById.get(data.strokeId) : undefined;
      const ev = Object.assign({ type: 'draw', seq }, data);
      drawingState.addEvent(ev);
      socket.broadcast.emit('draw', Object.assign({ id: socket.id, seq }, data));
    } catch (err) {
      console.error('Error handling draw event', err);
    }
  });

  // Shape/text/image events: store and broadcast so new clients can replay them
  socket.on('shape', (data) => {
    try {
      const seq = ++seqCounter;
      const ev = Object.assign({ type: 'shape', seq }, data);
      drawingState.addEvent(ev);
      socket.broadcast.emit('shape', Object.assign({ id: socket.id, seq }, data));
    } catch (err) {
      console.error('Error handling shape event', err);
    }
  });

  socket.on('text', (data) => {
    try {
      const seq = ++seqCounter;
      const ev = Object.assign({ type: 'text', seq }, data);
      drawingState.addEvent(ev);
      socket.broadcast.emit('text', Object.assign({ id: socket.id, seq }, data));
    } catch (err) {
      console.error('Error handling text event', err);
    }
  });

  socket.on('image', (data) => {
    try {
      const seq = ++seqCounter;
      const ev = Object.assign({ type: 'image', seq }, data);
      drawingState.addEvent(ev);
      socket.broadcast.emit('image', Object.assign({ id: socket.id, seq }, data));
    } catch (err) {
      console.error('Error handling image event', err);
    }
  });

  // Cursor position updates (throttled client-side recommended)
  socket.on('cursor', (data) => {
    // Cursor updates are best-effort. Include sender id and color so
    // receivers can render a consistent pointer marker.
    try {
      const out = Object.assign({ id: socket.id, color: users[socket.id]?.color }, data);
      socket.broadcast.emit('cursor', out);
    } catch (err) {
      // Do not treat cursor errors as fatal
      console.warn('Malformed cursor event received', err);
    }
  });

  // Undo (global) - remove last stroke
  socket.on('undo', () => {
    // Global undo: remove last stroke and tell all clients to re-init/replay.
    // This is simple and predictable; per-user undo can be implemented later.
    try {
      drawingState.undo();
      io.emit('initCanvas', drawingState.getHistoryFlat());
    } catch (err) {
      console.error('Error during undo', err);
    }
  });

  // Clear
  socket.on('clear', () => {
    try {
      drawingState.clear();
      io.emit('initCanvas', drawingState.getHistoryFlat());
    } catch (err) {
      console.error('Error during clear', err);
    }
  });

  // Redo (global)
  socket.on('redo', () => {
    try {
      drawingState.redo();
      io.emit('initCanvas', drawingState.getHistoryFlat());
    } catch (err) {
      console.error('Error during redo', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];
    io.emit('userList', users);
    // notify clients to remove any cursor for this user
    io.emit('userDisconnected', { id: socket.id });
  });
  // Respond to explicit init requests (useful after resize)
  socket.on('requestInit', () => {
    socket.emit('initCanvas', drawingState.getHistoryFlat());
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
