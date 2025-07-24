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
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Default Vite dev server URL
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

// A generic endpoint to send any command to the frontend
app.post('/command', (req, res) => {
  if (!connectedSocket) {
    return res.status(404).json({ error: 'No client connected' });
  }
  
  const command = req.body;
  if (!command || !command.command) {
    return res.status(400).json({ error: 'Invalid command structure. "command" field is required.' });
  }
  
  // Broadcast the command to the connected frontend client
  connectedSocket.emit('command', command);
  
  console.log('Sent command:', command);
  res.status(200).json({ message: 'Command sent successfully', sentCommand: command });
});


server.listen(3001, () => {
  console.log('Test server listening on http://localhost:3001');
  console.log('Ready to forward commands to the frontend.');
});
