// Collaborative Canvas client
// Responsibilities:
// - Wire up pointer events (mouse/touch/pen) and convert positions to normalized coords
// - Emit `start`/`draw` events to the server and render local strokes immediately
// - Render remote strokes incrementally as their `start`/`draw` events arrive
// - Throttle cursor/draw emissions to reduce network traffic
// NOTE: comments are intentionally concise and placed next to non-trivial logic.
const socket = window.socket || io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cursorsEl = document.getElementById('cursors');

// Tools & state
// tool may be: 'brush', 'eraser', 'rect', 'circle', 'text', 'image'
let tool = 'brush';
let drawing = false;
let color = document.getElementById('colorPicker').value;
let stroke = Number(document.getElementById('stroke').value);
let pointerId = null;
let currentStrokeId = null;
// shape/text/image helpers
let shapeStart = null; // {x,y}
let savedCanvasImage = null; // ImageData for preview restore
let pendingImageDataUrl = null; // dataURL when user uploads an image

// Throttling
let lastDrawEmit = 0;
const DRAW_THROTTLE_MS = 25; // emit draw events at most every 25ms
let lastCursorEmit = 0;
const CURSOR_THROTTLE_MS = 50;

// Track remote cursors and stroke last positions
const remoteCursors = new Map(); // id -> DOM element
const remoteLastPos = new Map(); // strokeId -> { x, y }

function resizeCanvas() {
	// Keep canvas sized to the viewport. After resize we request a fresh
	// init from the server so replay uses the new dimensions.
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	socket.emit('requestInit');
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getLocalCoords(e) {
	const rect = canvas.getBoundingClientRect();
	return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function generateStrokeId() {
	return `${socket.id || 'u'}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
}

function setCompositeForEvent(toolName, isRemote) {
	// Choose composite operation depending on tool and whether the event is
	// remote. Eraser uses destination-out to remove pixels. Remote strokes use
	// 'lighter' for a soft additive blend so overlapping remote strokes remain visible.
	if (toolName === 'eraser') ctx.globalCompositeOperation = 'destination-out';
	else if (isRemote) ctx.globalCompositeOperation = 'lighter';
	else ctx.globalCompositeOperation = 'source-over';
}

function applyCompositeForTool(t) {
	if (t === 'eraser') ctx.globalCompositeOperation = 'destination-out';
	else ctx.globalCompositeOperation = 'source-over';
}

function startDraw(e) {
	// Only start when the primary button is used for mouse; touch/pen always start.
	if (e.pointerType === 'mouse' && e.button !== 0) return;
	// Attempt to capture the pointer so we continue receiving events even if
	// the pointer leaves the canvas. Some browsers throw if capture isn't supported.
	try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
	pointerId = e.pointerId;

	const { x, y } = getLocalCoords(e);
	// Branch by tool type: freehand vs shapes/text/image
	if (tool === 'brush' || tool === 'eraser') {
		drawing = true;
		currentStrokeId = generateStrokeId(); // unique id per stroke for grouping
		applyCompositeForTool(tool);
		ctx.beginPath();
		ctx.moveTo(x, y);
		// Emit a `start` event with normalized coordinates to make replay device-agnostic.
		socket.emit('start', { xNorm: x / canvas.width, yNorm: y / canvas.height, color, stroke, tool, strokeId: currentStrokeId });
	} else if (tool === 'rect' || tool === 'circle') {
		// For shape tools we'll save the canvas state and draw a preview during move
		shapeStart = { x, y };
		try { savedCanvasImage = ctx.getImageData(0, 0, canvas.width, canvas.height); } catch (err) { savedCanvasImage = null; }
		drawing = true;
	} else if (tool === 'text') {
		// For text, we capture a single point and prompt for input
		const txt = prompt('Enter text');
		if (txt) {
			const tx = x, ty = y;
			ctx.fillStyle = color;
			ctx.font = `${Math.max(12, stroke * 4)}px sans-serif`;
			ctx.fillText(txt, tx, ty);
			// emit text event
			socket.emit('text', { text: String(txt), xNorm: tx / canvas.width, yNorm: ty / canvas.height, color, fontSize: Math.max(12, stroke * 4) });
		}
	} else if (tool === 'image') {
		// Place previously uploaded image at pointer location
		if (!pendingImageDataUrl) {
			alert('Please upload an image first (toolbar image input)');
			return;
		}
		const img = new Image();
		img.onload = () => {
			// scale image to a reasonable size (max 40% of canvas width)
			const maxW = canvas.width * 0.4;
			const scale = Math.min(1, maxW / img.width);
			const w = img.width * scale;
			const h = img.height * scale;
			// draw with top-left at pointer
			ctx.drawImage(img, x, y, w, h);
			socket.emit('image', { xNorm: x / canvas.width, yNorm: y / canvas.height, wNorm: w / canvas.width, hNorm: h / canvas.height, dataUrl: pendingImageDataUrl });
		};
		img.src = pendingImageDataUrl;
	}
}

function endDraw(e) {
	if (pointerId !== null) {
		try { canvas.releasePointerCapture(pointerId); } catch (err) {}
	}
	// finalize shape if needed
	if (drawing && (tool === 'rect' || tool === 'circle') && shapeStart) {
		const { x: x0, y: y0 } = shapeStart;
		const { x: x1, y: y1 } = getLocalCoords(e);
		// restore saved image if we have it then draw final shape
		if (savedCanvasImage) ctx.putImageData(savedCanvasImage, 0, 0);
		setCompositeForEvent(tool, false);
		ctx.strokeStyle = color;
		ctx.lineWidth = stroke;
		if (tool === 'rect') {
			const rx = Math.min(x0, x1), ry = Math.min(y0, y1), rw = Math.abs(x1 - x0), rh = Math.abs(y1 - y0);
			ctx.strokeRect(rx, ry, rw, rh);
			socket.emit('shape', { shape: 'rect', xNorm: rx / canvas.width, yNorm: ry / canvas.height, wNorm: rw / canvas.width, hNorm: rh / canvas.height, color, stroke });
		} else if (tool === 'circle') {
			const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
			const rx = Math.abs(x1 - x0) / 2;
			ctx.beginPath();
			ctx.ellipse(cx, cy, rx, rx, 0, 0, Math.PI * 2);
			ctx.stroke();
			socket.emit('shape', { shape: 'circle', cxNorm: cx / canvas.width, cyNorm: cy / canvas.height, rNorm: rx / canvas.width, color, stroke });
		}
	}
	drawing = false;
	pointerId = null;
	currentStrokeId = null;
	shapeStart = null;
	savedCanvasImage = null;
}

function draw(e) {
	const now = Date.now();
	const { x, y } = getLocalCoords(e);
	// emit cursor position (throttled) as normalized coords
	if (now - lastCursorEmit > CURSOR_THROTTLE_MS) {
		lastCursorEmit = now;
		// Cursor updates are best-effort and throttled to avoid flooding sockets.
		socket.emit('cursor', { xNorm: x / canvas.width, yNorm: y / canvas.height });
	}

	if (!drawing) return;
	// If we're in a shape tool, render a live preview by restoring the saved
	// canvas image and drawing the tentative shape/ellipse.
	if (tool === 'rect' || tool === 'circle') {
		if (!shapeStart) return;
		const { x: x0, y: y0 } = shapeStart;
		const { x: x1, y: y1 } = getLocalCoords(e);
		if (savedCanvasImage) ctx.putImageData(savedCanvasImage, 0, 0);
		setCompositeForEvent(tool, false);
		ctx.strokeStyle = color;
		ctx.lineWidth = stroke;
		if (tool === 'rect') {
			const rx = Math.min(x0, x1), ry = Math.min(y0, y1), rw = Math.abs(x1 - x0), rh = Math.abs(y1 - y0);
			ctx.strokeRect(rx, ry, rw, rh);
		} else {
			const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
			const rx = Math.abs(x1 - x0) / 2;
			ctx.beginPath();
			ctx.ellipse(cx, cy, rx, rx, 0, 0, Math.PI * 2);
			ctx.stroke();
		}
		return;
	}
	// Draw immediately on the local canvas for instant feedback, then emit
	// throttled `draw` events so other clients can render the incremental stroke.
	applyCompositeForTool(tool);
	ctx.lineWidth = stroke;
	ctx.strokeStyle = color;
	ctx.lineTo(x, y);
	ctx.stroke();

	if (now - lastDrawEmit > DRAW_THROTTLE_MS) {
		lastDrawEmit = now;
		socket.emit('draw', { xNorm: x / canvas.width, yNorm: y / canvas.height, color, stroke, tool, strokeId: currentStrokeId });
	}
}

// Use pointer events for mouse/touch/pen
canvas.addEventListener('pointerdown', startDraw);
canvas.addEventListener('pointerup', endDraw);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointercancel', endDraw);

// Incoming drawing events: start/draw
socket.on('start', (data) => {
	// When another client begins a stroke we set composite mode appropriately
	// and record the initial point so subsequent `draw` events can render
	// incremental segments from last->current.
	const isRemote = data.id && data.id !== socket.id;
	setCompositeForEvent(data.tool, isRemote);
	const rx = data.xNorm != null ? data.xNorm * canvas.width : data.x;
	const ry = data.yNorm != null ? data.yNorm * canvas.height : data.y;
	if (data.strokeId) {
		// Save last position for this remote stroke id
		remoteLastPos.set(data.strokeId, { x: rx, y: ry, color: data.color, stroke: data.stroke, tool: data.tool });
	} else {
		// Defensive fallback: start a path at this point
		ctx.beginPath();
		ctx.moveTo(rx, ry);
	}
});

// Shape events (rectangle/circle)
socket.on('shape', (data) => {
	try {
		setCompositeForEvent(data.tool || 'brush', true);
		ctx.strokeStyle = data.color || '#000';
		ctx.lineWidth = data.stroke || 2;
		if (data.shape === 'rect') {
			const x = (data.xNorm ?? data.x) * canvas.width;
			const y = (data.yNorm ?? data.y) * canvas.height;
			const w = (data.wNorm ?? 0) * canvas.width;
			const h = (data.hNorm ?? 0) * canvas.height;
			ctx.strokeRect(x, y, w, h);
		} else if (data.shape === 'circle') {
			const cx = (data.cxNorm ?? data.cx) * canvas.width;
			const cy = (data.cyNorm ?? data.cy) * canvas.height;
			const r = (data.rNorm ?? data.r) * canvas.width;
			ctx.beginPath();
			ctx.ellipse(cx, cy, r, r, 0, 0, Math.PI * 2);
			ctx.stroke();
		}
	} catch (err) {
		console.error('Error rendering shape event', err);
	}
});

// Text events
socket.on('text', (data) => {
	try {
		const x = (data.xNorm ?? data.x) * canvas.width;
		const y = (data.yNorm ?? data.y) * canvas.height;
		ctx.fillStyle = data.color || '#000';
		ctx.font = `${data.fontSize || 16}px sans-serif`;
		ctx.fillText(data.text || '', x, y);
	} catch (err) {
		console.error('Error rendering text event', err);
	}
});

// Image events
socket.on('image', (data) => {
	try {
		const img = new Image();
		img.onload = () => {
			const x = (data.xNorm ?? data.x) * canvas.width;
			const y = (data.yNorm ?? data.y) * canvas.height;
			const w = (data.wNorm ?? data.w) * canvas.width;
			const h = (data.hNorm ?? data.h) * canvas.height;
			ctx.drawImage(img, x, y, w || img.width, h || img.height);
		};
		img.src = data.dataUrl;
	} catch (err) {
		console.error('Error rendering image event', err);
	}
});

socket.on('draw', (data) => {
	// Remote incremental draw: prefer drawing a segment from the stored last
	// position for the strokeId. This avoids interleaving when many users draw.
	const isRemote = data.id && data.id !== socket.id;
	setCompositeForEvent(data.tool, isRemote);
	ctx.strokeStyle = data.color;
	ctx.lineWidth = data.stroke;
	const rx = data.xNorm != null ? data.xNorm * canvas.width : data.x;
	const ry = data.yNorm != null ? data.yNorm * canvas.height : data.y;
	if (data.strokeId && remoteLastPos.has(data.strokeId)) {
		const last = remoteLastPos.get(data.strokeId);
		ctx.beginPath();
		ctx.moveTo(last.x, last.y);
		ctx.lineTo(rx, ry);
		ctx.stroke();
		// update last position for next segment
		remoteLastPos.set(data.strokeId, { x: rx, y: ry, color: data.color, stroke: data.stroke, tool: data.tool });
	} else {
		// Fallback: draw as a continuation
		ctx.lineTo(rx, ry);
		ctx.stroke();
	}
});

socket.on('initCanvas', (history) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	remoteLastPos.clear();
	// Replay history sequentially. History is expected to be a flat chronological
	// list of events (start/draw/shape/text/image). Processing sequentially
	// preserves the original composition order.
	history.forEach(ev => {
		if (!ev || !ev.type) return;
		try {
			if (ev.type === 'start') {
				// initialize last position for stroke
				const rx = ev.xNorm != null ? ev.xNorm * canvas.width : ev.x;
				const ry = ev.yNorm != null ? ev.yNorm * canvas.height : ev.y;
				if (ev.strokeId) remoteLastPos.set(ev.strokeId, { x: rx, y: ry, color: ev.color, stroke: ev.stroke, tool: ev.tool });
			} else if (ev.type === 'draw') {
				const rx = ev.xNorm != null ? ev.xNorm * canvas.width : ev.x;
				const ry = ev.yNorm != null ? ev.yNorm * canvas.height : ev.y;
				if (ev.strokeId && remoteLastPos.has(ev.strokeId)) {
					const last = remoteLastPos.get(ev.strokeId);
					setCompositeForEvent(ev.tool, true);
					ctx.strokeStyle = ev.color;
					ctx.lineWidth = ev.stroke;
					ctx.beginPath();
					ctx.moveTo(last.x, last.y);
					ctx.lineTo(rx, ry);
					ctx.stroke();
					remoteLastPos.set(ev.strokeId, { x: rx, y: ry, color: ev.color, stroke: ev.stroke, tool: ev.tool });
				} else {
					// If no stroke context, draw a single point or move-to
					ctx.beginPath();
					ctx.moveTo(rx, ry);
					ctx.lineTo(rx + 0.1, ry + 0.1);
					ctx.stroke();
				}
			} else if (ev.type === 'shape') {
				// Render rectangle/circle
				if (ev.shape === 'rect') {
					const x = (ev.xNorm ?? ev.x) * canvas.width;
					const y = (ev.yNorm ?? ev.y) * canvas.height;
					const w = (ev.wNorm ?? ev.w) * canvas.width;
					const h = (ev.hNorm ?? ev.h) * canvas.height;
					ctx.strokeStyle = ev.color || '#000';
					ctx.lineWidth = ev.stroke || 2;
					ctx.strokeRect(x, y, w, h);
				} else if (ev.shape === 'circle') {
					const cx = (ev.cxNorm ?? ev.cx) * canvas.width;
					const cy = (ev.cyNorm ?? ev.cy) * canvas.height;
					const r = (ev.rNorm ?? ev.r) * canvas.width;
					ctx.strokeStyle = ev.color || '#000';
					ctx.lineWidth = ev.stroke || 2;
					ctx.beginPath();
					ctx.ellipse(cx, cy, r, r, 0, 0, Math.PI * 2);
					ctx.stroke();
				}
			} else if (ev.type === 'text') {
				const x = (ev.xNorm ?? ev.x) * canvas.width;
				const y = (ev.yNorm ?? ev.y) * canvas.height;
				ctx.fillStyle = ev.color || '#000';
				ctx.font = `${ev.fontSize || 16}px sans-serif`;
				ctx.fillText(ev.text || '', x, y);
			} else if (ev.type === 'image') {
				const img = new Image();
				img.onload = () => {
					const x = (ev.xNorm ?? ev.x) * canvas.width;
					const y = (ev.yNorm ?? ev.y) * canvas.height;
					const w = (ev.wNorm ?? ev.w) * canvas.width;
					const h = (ev.hNorm ?? ev.h) * canvas.height;
					ctx.drawImage(img, x, y, w || img.width, h || img.height);
				};
				img.src = ev.dataUrl;
			} else {
				// Unknown event types can be ignored
			}
		} catch (err) {
			console.warn('Error replaying history event', err, ev);
		}
	});
});

// Toolbar actions
document.getElementById('clear').addEventListener('click', () => socket.emit('clear'));
document.getElementById('undo').addEventListener('click', () => socket.emit('undo'));
document.getElementById('redo').addEventListener('click', () => socket.emit('redo'));
document.getElementById('eraser').addEventListener('click', (e) => {
	// toggle eraser on/off
	tool = tool === 'eraser' ? 'brush' : 'eraser';
	e.target.textContent = tool === 'eraser' ? 'Eraser (on)' : 'Eraser';
});
document.getElementById('colorPicker').addEventListener('change', e => color = e.target.value);
document.getElementById('stroke').addEventListener('change', e => stroke = Number(e.target.value));
// Tool select
const toolSelect = document.getElementById('toolSelect');
if (toolSelect) toolSelect.addEventListener('change', e => { tool = e.target.value; });
// Image input
const imageInput = document.getElementById('imageInput');
if (imageInput) imageInput.addEventListener('change', (ev) => {
	const f = ev.target.files && ev.target.files[0];
	if (!f) return;
	const reader = new FileReader();
	reader.onload = () => { pendingImageDataUrl = reader.result; alert('Image loaded. Choose Image tool and click canvas to place it.'); };
	reader.readAsDataURL(f);
});

// User list update
socket.on('userList', (users) => {
	const list = document.getElementById('users');
	list.innerHTML = '';
	Object.entries(users).forEach(([id, u]) => {
		const li = document.createElement('li');
		li.textContent = id;
		li.style.color = u.color;
		list.appendChild(li);
	});
	// Remove any cursors for users no longer present
	Array.from(remoteCursors.keys()).forEach(id => {
		if (!users[id]) {
			const el = remoteCursors.get(id);
			if (el) el.remove();
			remoteCursors.delete(id);
		}
	});
});

// Cursor handling
socket.on('cursor', (data) => {
	// data: { id, xNorm, yNorm, color }
	let el = remoteCursors.get(data.id);
	if (!el) {
		el = document.createElement('div');
		el.className = 'cursor';
		el.style.background = data.color || '#000';
		cursorsEl.appendChild(el);
		remoteCursors.set(data.id, el);
	}
	// position using normalized coords if present
	const px = data.xNorm != null ? data.xNorm * canvas.width : data.x;
	const py = data.yNorm != null ? data.yNorm * canvas.height : data.y;
	el.style.left = `${px}px`;
	el.style.top = `${py}px`;
});

socket.on('userDisconnected', ({ id }) => {
	const el = remoteCursors.get(id);
	if (el) {
		el.remove();
		remoteCursors.delete(id);
	}
});

