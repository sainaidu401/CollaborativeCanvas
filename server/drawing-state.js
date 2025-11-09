// drawing-state.js
// Manages drawing history as grouped strokes.
// Each stroke object looks like:
// { id: <strokeId>, seq: <server-seq>, tool, color, width, events: [ {type, xNorm, yNorm, ...} ] }

// In-memory store (simple and fast). For persistence, replace these structures
// with a backing store (file/db) and replay on startup.
let strokes = []; // chronological list of stroke objects
let redoStack = []; // LIFO stack for undone strokes

function addEvent(event) {
  // Add typed events into grouped stroke objects. This function accepts
  // 'start' and 'draw' events; callers should attach a `type` property.
  if (event.type === 'start') {
    // Create a new stroke and push it to the end of the list. `seq` may be
    // assigned by the server and is preserved here for deterministic replay.
    const stroke = {
      id: event.strokeId || `${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      seq: event.seq,
      tool: event.tool || 'brush',
      color: event.color,
      width: event.stroke,
      events: [event]
    };
    strokes.push(stroke);
    // Any new user action invalidates the redo stack (typical undo/redo semantics)
    redoStack.length = 0;
  } else if (event.type === 'draw') {
    // Append draw events to the associated stroke. If the stroke isn't found
    // we defensively create one so the state remains consistent.
    const sid = event.strokeId;
    if (!sid) return; // malformed event: ignore
    const stroke = strokes.find(s => s.id === sid);
    if (stroke) {
      stroke.events.push(event);
    } else {
      // Defensive creation: preserve fields from the draw event
      const newStroke = {
        id: sid,
        seq: event.seq,
        tool: event.tool || 'brush',
        color: event.color,
        width: event.stroke,
        events: [event]
      };
      strokes.push(newStroke);
    }
  } else if (event.type === 'shape' || event.type === 'text' || event.type === 'image') {
    // Non-stroke events: store them as single-event "strokes" so the history
    // export remains a flat list and replay works. We generate an id when
    // one isn't provided.
    const id = event.id || `${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    const container = {
      id,
      seq: event.seq,
      tool: event.type,
      color: event.color,
      width: event.stroke,
      events: [event]
    };
    strokes.push(container);
    redoStack.length = 0;
  }
}

function getHistoryFlat() {
  // Return a flat list of events in chronological order. Consumers (clients)
  // will use strokeId + seq ordering to group and replay if desired.
  const flat = [];
  strokes.forEach(s => {
    s.events.forEach(ev => flat.push(ev));
  });
  return flat;
}

function clear() {
  strokes = [];
  redoStack = [];
}

function undo() {
  // Pop the last stroke (global LIFO) and push to redo stack. Returns
  // a boolean indicating whether an undo occurred.
  if (strokes.length === 0) return false;
  const s = strokes.pop();
  redoStack.push(s);
  return true;
}

function redo() {
  if (redoStack.length === 0) return false;
  const s = redoStack.pop();
  strokes.push(s);
  return true;
}

module.exports = { addEvent, getHistoryFlat, clear, undo, redo };
