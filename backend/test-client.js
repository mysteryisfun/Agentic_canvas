#!/usr/bin/env node

// Test client for the Multi-Agent Canvas Command Protocol
// This demonstrates how external agents can send commands to the canvas

const WebSocket = require('ws');

console.log('🧪 Starting Canvas Command Protocol Test Client...');

const ws = new WebSocket('ws://localhost:8082');

ws.on('open', function open() {
  console.log('✅ Connected to Multi-Agent Canvas Server');
  
  // Test sending a custom command
  setTimeout(() => {
    const testCommand = {
      commandType: "addElement",
      elementId: `test-text-${Date.now()}`,
      timestamp: new Date().toISOString(),
      payload: {
        elementType: "text",
        content: "🧪 Test Client Connected Successfully!",
        position: { x: 50, y: 200 },
        styles: {
          fontSize: "24px",
          color: "#e74c3c",
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          width: "600px"
        },
        animation: { type: "fadeIn", duration: 0.8 }
      }
    };
    
    console.log('📤 Sending test command:', testCommand.commandType);
    ws.send(JSON.stringify(testCommand));
  }, 2000);

  // Test image command
  setTimeout(() => {
    const imageCommand = {
      commandType: "addElement", 
      elementId: `test-image-${Date.now()}`,
      timestamp: new Date().toISOString(),
      payload: {
        elementType: "image",
        url: "https://picsum.photos/300/200?random=999",
        position: { x: 400, y: 200 },
        size: { width: 300, height: 200 },
        opacity: 0.8,
        animation: { type: "slideInFromLeft", duration: 1.0 }
      }
    };
    
    console.log('📤 Sending image command:', imageCommand.commandType);
    ws.send(JSON.stringify(imageCommand));
  }, 4000);

  // Test custom drawing script
  setTimeout(() => {
    const scriptCommand = {
      commandType: "executeScript",
      elementId: `test-script-${Date.now()}`,
      timestamp: new Date().toISOString(),
      payload: {
        elementType: "drawing",
        scriptCode: `
          const canvas = document.querySelector('canvas');
          if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.save();
            
            // Draw a test pattern
            ctx.beginPath();
            ctx.arc(300, 400, 50, 0, 2 * Math.PI);
            ctx.fillStyle = '#3498db';
            ctx.fill();
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Add text
            ctx.font = '16px Arial';
            ctx.fillStyle = '#2c3e50';
            ctx.textAlign = 'center';
            ctx.fillText('Test Script Executed ✓', 300, 370);
            
            ctx.restore();
          }
        `,
        isPersistent: false
      }
    };
    
    console.log('📤 Sending script command:', scriptCommand.commandType);
    ws.send(JSON.stringify(scriptCommand));
  }, 6000);

  // Test clearing canvas after 15 seconds
  setTimeout(() => {
    const clearCommand = {
      commandType: "clearCanvas",
      elementId: `clear-${Date.now()}`,
      timestamp: new Date().toISOString(),
      payload: {}
    };
    
    console.log('📤 Sending clear command:', clearCommand.commandType);
    ws.send(JSON.stringify(clearCommand));
  }, 15000);

  // Disconnect after 20 seconds
  setTimeout(() => {
    console.log('👋 Test complete, disconnecting...');
    ws.close();
  }, 20000);
});

ws.on('message', function message(data) {
  try {
    const command = JSON.parse(data);
    console.log('📥 Received command:', command.commandType, command.elementId?.substring(0, 20) + '...');
  } catch (error) {
    console.log('📥 Received message:', data.toString().substring(0, 100) + '...');
  }
});

ws.on('close', function close() {
  console.log('🔌 Disconnected from server');
  process.exit(0);
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err.message);
  process.exit(1);
});
