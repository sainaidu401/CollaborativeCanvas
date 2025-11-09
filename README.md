# Collaborative Canvas

A simple multi-user collaborative drawing app using Node.js and Socket.IO with an HTML5 canvas frontend.

How to run (development):

1. Install dependencies

```bash
npm install
```

2. Start the server

```bash
npm start
```

3. Open http://localhost:3000 in multiple browser windows

What this repo contains

- `client/` - frontend files (HTML, CSS, JS)
- `server/` - Node.js server and helper modules
- `package.json` - project metadata and scripts

Notes

- This project intentionally uses vanilla JS and no drawing libraries.
- The server currently stores drawing history in memory. For production, persist to a database and limit history size.

Next steps (recommended):

- Implement touch input handling for mobile.
- Implement global undo/redo that operates at stroke granularity.
- Implement cursor indicators for remote users and conflict-resolution heuristics.
- Add automated tests and CI.
