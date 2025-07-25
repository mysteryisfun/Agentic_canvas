#!/usr/bin/env node

// Multi-Agent Canvas WebSocket Server
// Implements the comprehensive JSON command protocol for backend-to-frontend communication

const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

// Create HTTP server
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Store connected clients and active elements
const clients = new Set();
const canvasElements = new Map(); // Track all elements on canvas
const agents = new Map(); // Active agents

console.log('🚀 Multi-Agent Canvas WebSocket Server Starting...');

// Utility function to create ISO 8601 timestamp
function getTimestamp() {
  return new Date().toISOString();
}

// Command factory functions for different element types
const CommandFactory = {
  // Add text element
  addText: (content, position = { x: 50, y: 50 }, styles = {}) => {
    const elementId = `text-${uuidv4()}`;
    return {
      commandType: "addElement",
      elementId,
      timestamp: getTimestamp(),
      payload: {
        elementType: "text",
        content,
        position,
        styles: {
          fontSize: "24px",
          color: "#333333",
          fontFamily: "Arial, sans-serif",
          fontWeight: "normal",
          textAlign: "left",
          width: "400px",
          ...styles
        },
        animation: { type: "fadeIn", duration: 0.5 }
      }
    };
  },

  // Add image element
  addImage: (url, position = { x: 200, y: 150 }, size = { width: 400, height: 300 }) => {
    const elementId = `image-${uuidv4()}`;
    return {
      commandType: "addElement",
      elementId,
      timestamp: getTimestamp(),
      payload: {
        elementType: "image",
        url,
        position,
        size,
        opacity: 1.0,
        animation: { type: "slideInFromRight", duration: 0.7 }
      }
    };
  },

  // Add video element
  addVideo: (url, position = { x: 100, y: 350 }, size = { width: 640, height: 360 }, options = {}) => {
    const elementId = `video-${uuidv4()}`;
    return {
      commandType: "addElement",
      elementId,
      timestamp: getTimestamp(),
      payload: {
        elementType: "video",
        url,
        position,
        size,
        autoplay: false,
        loop: false,
        controls: true,
        ...options
      }
    };
  },

  // Add 3D model element
  add3DModel: (modelUrl, position = { x: 0, y: 0, z: 0 }, options = {}) => {
    const elementId = `3dmodel-${uuidv4()}`;
    return {
      commandType: "addElement",
      elementId,
      timestamp: getTimestamp(),
      payload: {
        elementType: "3dModel",
        modelUrl,
        position,
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        isInteractive: true,
        ...options
      }
    };
  },

  // Update existing element
  updateElement: (elementId, elementType, updates) => ({
    commandType: "updateElement",
    elementId,
    timestamp: getTimestamp(),
    payload: {
      elementType,
      ...updates
    }
  }),

  // Remove element
  removeElement: (elementId) => ({
    commandType: "removeElement",
    elementId,
    timestamp: getTimestamp(),
    payload: {}
  }),

  // Execute custom script
  executeScript: (scriptCode, elementType = "drawing", isPersistent = false) => {
    const elementId = `script-${uuidv4()}`;
    return {
      commandType: "executeScript",
      elementId,
      timestamp: getTimestamp(),
      payload: {
        elementType,
        scriptCode,
        isPersistent
      }
    };
  },

  // Clear entire canvas
  clearCanvas: () => ({
    commandType: "clearCanvas",
    elementId: `canvas-clear-${uuidv4()}`,
    timestamp: getTimestamp(),
    payload: {}
  }),

  // Set 3D focus
  set3DFocus: (elementId, focusType, options = {}) => ({
    commandType: "set3DFocus",
    elementId,
    timestamp: getTimestamp(),
    payload: {
      focusType,
      targetPosition: { x: 0, y: 0, z: 0 },
      animationDuration: 1.0,
      ...options
    }
  })
};

wss.on('connection', (ws) => {
  console.log('🔗 New client connected');
  clients.add(ws);
  
  // Send welcome message using new command format
  const welcomeCommand = CommandFactory.addText(
    '🎉 Multi-Agent Canvas Connected!',
    { x: 50, y: 50 },
    { fontSize: "28px", color: "#51cf66", fontWeight: "bold" }
  );
  
  ws.send(JSON.stringify(welcomeCommand));
  canvasElements.set(welcomeCommand.elementId, welcomeCommand);

  ws.on('message', (message) => {
    try {
      const receivedCommand = JSON.parse(message);
      console.log('📨 Received command:', receivedCommand.commandType, receivedCommand.elementId);
      
      // Validate command structure
      if (!receivedCommand.commandType || !receivedCommand.elementId) {
        console.error('❌ Invalid command structure:', receivedCommand);
        return;
      }

      // Process command and update element tracking
      switch (receivedCommand.commandType) {
        case 'addElement':
          canvasElements.set(receivedCommand.elementId, receivedCommand);
          break;
        case 'updateElement':
          if (canvasElements.has(receivedCommand.elementId)) {
            const existing = canvasElements.get(receivedCommand.elementId);
            // Merge updates into existing element
            canvasElements.set(receivedCommand.elementId, {
              ...existing,
              ...receivedCommand,
              payload: { ...existing.payload, ...receivedCommand.payload }
            });
          }
          break;
        case 'removeElement':
          canvasElements.delete(receivedCommand.elementId);
          break;
        case 'clearCanvas':
          canvasElements.clear();
          break;
      }
      
      // Broadcast command to all other clients
      clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(receivedCommand));
        }
      });
      
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('👋 Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
    clients.delete(ws);
  });
});

// Demo: Simulate comprehensive agent activities using new command format
function simulateAgentActivity() {
  const activities = [
    // Text-based status updates
    () => CommandFactory.addText(
      `Agent Status: ${['Processing Data', 'Analyzing Results', 'Task Complete', 'Awaiting Input'][Math.floor(Math.random() * 4)]}`,
      { x: Math.random() * 400 + 50, y: Math.random() * 200 + 50 },
      { fontSize: "18px", color: "#4a9eff", fontWeight: "bold" }
    ),

    // Educational content with images
    () => CommandFactory.addImage(
      `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`,
      { x: Math.random() * 300 + 100, y: Math.random() * 200 + 150 },
      { width: 300, height: 200 }
    ),

    // Video demonstration
    () => CommandFactory.addVideo(
      "https://www.w3schools.com/html/mov_bbb.mp4",
      { x: Math.random() * 200 + 100, y: Math.random() * 100 + 250 },
      { width: 320, height: 240 },
      { autoplay: true, loop: true, controls: false }
    ),

    // 3D model showcase
    () => CommandFactory.add3DModel(
      "https://threejs.org/examples/models/gltf/Duck/glTF/Duck.gltf",
      { x: Math.random() * 2 - 1, y: 0, z: Math.random() * 2 - 1 },
      { 
        rotation: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
        scale: { x: 0.5, y: 0.5, z: 0.5 }
      }
    ),

    // Custom drawing script
    () => CommandFactory.executeScript(
      `
      const canvas = document.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(${Math.random() * 400 + 100}, ${Math.random() * 300 + 100}, 30, 0, 2 * Math.PI);
      ctx.fillStyle = 'hsl(${Math.random() * 360}, 70%, 50%)';
      ctx.fill();
      ctx.stroke();
      `,
      "drawing",
      false
    )
  ];

  const activity = activities[Math.floor(Math.random() * activities.length)];
  const command = activity();

  // Track the element
  if (command.commandType === 'addElement') {
    canvasElements.set(command.elementId, command);
  }

  // Send to all connected clients
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(command));
    }
  });

  console.log(`🤖 Simulated agent activity: ${command.commandType} (${command.payload.elementType})`);
}

// Advanced agent simulation functions
function simulateManagerAgent() {
  console.log('🧠 Manager Agent: Orchestrating learning sequence...');
  
  // Clear canvas first
  const clearCommand = CommandFactory.clearCanvas();
  broadcastCommand(clearCommand);
  
  setTimeout(() => {
    // Add lesson title
    const titleCommand = CommandFactory.addText(
      "🚀 AI-Powered Learning: Solar System",
      { x: 50, y: 30 },
      { fontSize: "36px", color: "#2c3e50", fontWeight: "bold", width: "800px" }
    );
    broadcastCommand(titleCommand);
  }, 500);

  setTimeout(() => {
    // Add educational image
    const imageCommand = CommandFactory.addImage(
      "https://science.nasa.gov/wp-content/uploads/2023/04/solar-system-scaled.jpg",
      { x: 100, y: 100 },
      { width: 600, height: 400 }
    );
    broadcastCommand(imageCommand);
  }, 1500);

  setTimeout(() => {
    // Add 3D model
    const modelCommand = CommandFactory.add3DModel(
      "https://threejs.org/examples/models/gltf/Duck/glTF/Duck.gltf",
      { x: 0, y: 0, z: 0 },
      { scale: { x: 2, y: 2, z: 2 } }
    );
    broadcastCommand(modelCommand);
  }, 3000);
}

function simulateCanvasAgent() {
  console.log('🎨 Canvas Agent: Creating interactive visualization...');
  
  // Dynamic drawing script
  const drawingScript = `
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.save();
      
      // Draw orbit paths
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(400, 300, 50 + i * 40, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.stroke();
      }
      
      // Draw sun
      ctx.beginPath();
      ctx.arc(400, 300, 25, 0, 2 * Math.PI);
      ctx.fillStyle = '#FDB813';
      ctx.fill();
      
      ctx.restore();
    }
  `;
  
  const scriptCommand = CommandFactory.executeScript(drawingScript, "animation", true);
  broadcastCommand(scriptCommand);
}

function demonstrate3DFocus() {
  console.log('🎯 3D Focus Agent: Demonstrating camera control...');
  
  // Find any 3D model elements
  const modelElements = Array.from(canvasElements.values())
    .filter(element => element.payload?.elementType === '3dModel');
  
  if (modelElements.length > 0) {
    const modelId = modelElements[0].elementId;
    const focusCommand = CommandFactory.set3DFocus(
      modelId,
      "cameraLookAt",
      {
        targetPosition: { x: 5, y: 2, z: 3 },
        animationDuration: 2.0
      }
    );
    broadcastCommand(focusCommand);
  }
}

// Utility function to broadcast commands
function broadcastCommand(command) {
  // Track the element if it's an add command
  if (command.commandType === 'addElement') {
    canvasElements.set(command.elementId, command);
  } else if (command.commandType === 'removeElement') {
    canvasElements.delete(command.elementId);
  } else if (command.commandType === 'clearCanvas') {
    canvasElements.clear();
  }

  // Send to all connected clients
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(command));
    }
  });
}

// API endpoints for external agent integration
function setupAgentAPI() {
  // This could be expanded to REST API endpoints or additional WebSocket channels
  console.log('🔧 Agent API ready for external integrations');
}
// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🌐 Multi-Agent Canvas Server running on ws://localhost:${PORT}/canvas`);
  console.log('📊 Command Types Supported:');
  console.log('  • addElement (text, image, video, 3dModel)');
  console.log('  • updateElement (modify existing elements)');
  console.log('  • removeElement (delete specific elements)');
  console.log('  • executeScript (custom JavaScript execution)');
  console.log('  • clearCanvas (remove all elements)');
  console.log('  • set3DFocus (camera/highlighting control)');
  console.log('');
  console.log('� Agent Simulation Modes:');
  console.log('  • Random activities every 15 seconds');
  console.log('  • Manager Agent demo every 60 seconds');
  console.log('  • Canvas Agent demo every 45 seconds');
  console.log('  • 3D Focus demo every 90 seconds');
  console.log('');
  console.log('🔗 Ready for backend agent connections...');
  
  // Setup agent API
  setupAgentAPI();
  
  // Start various demo activities
  setInterval(simulateAgentActivity, 15000); // Random activities
  setInterval(simulateManagerAgent, 60000);   // Manager orchestration
  setInterval(simulateCanvasAgent, 45000);    // Canvas drawing
  setInterval(demonstrate3DFocus, 90000);     // 3D control
  
  // Initial demo after 5 seconds
  setTimeout(simulateManagerAgent, 5000);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Canvas Server...');
  wss.close(() => {
    process.exit(0);
  });
});
