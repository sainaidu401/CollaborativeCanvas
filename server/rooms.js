// Simple room manager
// Exposes helpers to create/join/leave rooms. For this small app we keep things lightweight.

const rooms = new Map(); // roomId -> Set(socketId)

function ensureRoom(id) {
  if (!rooms.has(id)) rooms.set(id, new Set());
  return rooms.get(id);
}

function joinRoom(roomId, socketId) {
  const room = ensureRoom(roomId);
  room.add(socketId);
}

function leaveRoom(roomId, socketId) {
  const room = rooms.get(roomId);
  if (!room) return;
  room.delete(socketId);
  if (room.size === 0) rooms.delete(roomId);
}

function listRooms() {
  return Array.from(rooms.keys());
}

function members(roomId) {
  const room = rooms.get(roomId);
  return room ? Array.from(room) : [];
}

module.exports = { joinRoom, leaveRoom, listRooms, members };
