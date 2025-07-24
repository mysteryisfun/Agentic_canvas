// test-server.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
const server = http.createServer(app);

// The port (3001) must match the WEBSOCKET_URL in the frontend hook
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Default Vite dev server URL
    methods: ["GET", "POST"]
  }
});

let connectedSocket = null;

io.on('connection', (socket) => {
  console.log('Frontend connected:', socket.id);
  connectedSocket = socket;
  socket.on('disconnect', () => {
    console.log('Frontend disconnected');
    connectedSocket = null;
  });
});

// --- API Endpoints to Trigger WebSocket Commands ---

// Example: Add a text element
app.post('/add-text', (req, res) => {
  if (!connectedSocket) return res.status(404).send('No client connected');
  
  const command = {
    command: 'ADD_ELEMENT',
    payload: {
      id: `text-${Date.now()}`,
      type: 'text',
      content: 'Hello from the test server!',
      position: { x: 50, y: 100 },
      size: { width: 200, height: 50 }
    }
  };
  
  connectedSocket.emit('command', command);
  console.log('Sent command:', command);
  res.status(200).send('Sent ADD_ELEMENT command');
});

// Example: Remove an element
app.post('/remove-element', (req, res) => {
  if (!connectedSocket) return res.status(404).send('No client connected');
  const { id } = req.body;
  if (!id) return res.status(400).send('Missing "id" in request body');

  const command = {
    command: 'REMOVE_ELEMENT',
    payload: { id }
  };

  connectedSocket.emit('command', command);
  console.log('Sent command:', command);
  res.status(200).send(`Sent REMOVE_ELEMENT command for ID: ${id}`);
});

// Example: Clear the canvas
app.post('/clear', (req, res) => {
    if (!connectedSocket) return res.status(404).send('No client connected');

    const command = {
        command: 'CLEAR_CANVAS',
        payload: null
    };

    connectedSocket.emit('command', command);
    console.log('Sent command:', command);
    res.status(200).send('Sent CLEAR_CANVAS command');
});


server.listen(3001, () => {
  console.log('Test server listening on http://localhost:3001');
});
