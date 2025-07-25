# Multi-Agent Canvas Command Protocol

## Overview

This document describes the comprehensive JSON command protocol for communication between backend agents (Manager Agent, Canvas Agent, etc.) and the frontend Multi-Agent Canvas system via WebSocket connections.

## Command Structure

All commands follow a consistent structure:

```json
{
  "commandType": "string",
  "elementId": "string", 
  "timestamp": "string",
  "payload": { /* varies by command */ }
}
```

### Core Fields

- **commandType**: The action to perform (`addElement`, `updateElement`, `removeElement`, `executeScript`, `clearCanvas`, `set3DFocus`)
- **elementId**: Unique identifier (UUID) for each canvas element
- **timestamp**: ISO 8601 formatted timestamp for command ordering
- **payload**: Command-specific data

## Command Types

### 1. addElement

Creates new visual components on the canvas.

#### Text Element
```json
{
  "commandType": "addElement",
  "elementId": "text-uuid-12345",
  "timestamp": "2025-07-26T18:30:00.123Z",
  "payload": {
    "elementType": "text",
    "content": "Welcome to our AI-powered learning journey!",
    "position": { "x": 50, "y": 50 },
    "styles": {
      "fontSize": "32px",
      "color": "#333333",
      "fontFamily": "Arial, sans-serif",
      "fontWeight": "bold",
      "textAlign": "left",
      "width": "800px"
    },
    "animation": { "type": "fadeIn", "duration": 0.5 }
  }
}
```

#### Image Element
```json
{
  "commandType": "addElement",
  "elementId": "image-uuid-67890",
  "timestamp": "2025-07-26T18:30:05.456Z",
  "payload": {
    "elementType": "image",
    "url": "https://example.com/images/planet-earth.png",
    "position": { "x": 200, "y": 150 },
    "size": { "width": 400, "height": 300 },
    "opacity": 1.0,
    "animation": { "type": "slideInFromRight", "duration": 0.7 }
  }
}
```

#### Video Element
```json
{
  "commandType": "addElement",
  "elementId": "video-uuid-11223",
  "timestamp": "2025-07-26T18:30:10.789Z",
  "payload": {
    "elementType": "video",
    "url": "https://example.com/videos/solar-system-intro.mp4",
    "position": { "x": 100, "y": 350 },
    "size": { "width": 640, "height": 360 },
    "autoplay": true,
    "loop": false,
    "controls": false
  }
}
```

#### 3D Model Element
```json
{
  "commandType": "addElement",
  "elementId": "3dmodel-uuid-44556",
  "timestamp": "2025-07-26T18:30:15.012Z",
  "payload": {
    "elementType": "3dModel",
    "modelUrl": "https://example.com/models/mars.glb",
    "position": { "x": 0, "y": 0, "z": 0 },
    "rotation": { "x": 0, "y": 0, "z": 0 },
    "scale": { "x": 1, "y": 1, "z": 1 },
    "environmentMapUrl": "https://example.com/hdri/sky.hdr",
    "isInteractive": true
  }
}
```

### 2. updateElement

Modifies existing canvas elements. Only include properties that need to change.

```json
{
  "commandType": "updateElement",
  "elementId": "text-uuid-12345",
  "timestamp": "2025-07-26T18:30:20.345Z",
  "payload": {
    "elementType": "text",
    "content": "Now focusing on **Planetary Motion**.",
    "position": { "x": 100, "y": 50 },
    "styles": { "color": "#007bff", "fontSize": "36px" }
  }
}
```

#### Video Control Example
```json
{
  "commandType": "updateElement",
  "elementId": "video-uuid-11223",
  "timestamp": "2025-07-26T18:30:25.678Z",
  "payload": {
    "elementType": "video",
    "action": "play",
    "seekTime": 15
  }
}
```

### 3. removeElement

Removes specific elements from the canvas.

```json
{
  "commandType": "removeElement",
  "elementId": "image-uuid-67890",
  "timestamp": "2025-07-26T18:30:30.901Z",
  "payload": {}
}
```

### 4. executeScript

Executes custom JavaScript for dynamic drawing, animations, or interactions.

```json
{
  "commandType": "executeScript",
  "elementId": "script-uuid-99887",
  "timestamp": "2025-07-26T18:30:35.234Z",
  "payload": {
    "elementType": "drawing",
    "scriptCode": "canvasContext.beginPath(); canvasContext.arc(150, 150, 100, 0, 2 * Math.PI); canvasContext.stroke();",
    "isPersistent": false
  }
}
```

**Security Note**: Exercise caution with arbitrary JavaScript execution. Consider using sandboxed environments or predefined function sets.

### 5. clearCanvas

Removes all elements from the canvas.

```json
{
  "commandType": "clearCanvas",
  "elementId": "canvas-clear-command",
  "timestamp": "2025-07-26T18:30:40.567Z",
  "payload": {}
}
```

### 6. set3DFocus

Controls 3D model viewing, highlighting, and camera positioning.

```json
{
  "commandType": "set3DFocus",
  "elementId": "3dmodel-uuid-44556",
  "timestamp": "2025-07-26T18:30:45.890Z",
  "payload": {
    "focusType": "cameraLookAt",
    "targetPosition": { "x": 10, "y": 5, "z": 0 },
    "partName": "SaturnRing",
    "animationDuration": 1.0
  }
}
```

## Server Implementation

The `canvas-server.js` provides:

### Command Factory Functions
- `CommandFactory.addText()` - Create text elements
- `CommandFactory.addImage()` - Create image elements  
- `CommandFactory.addVideo()` - Create video elements
- `CommandFactory.add3DModel()` - Create 3D model elements
- `CommandFactory.updateElement()` - Update existing elements
- `CommandFactory.removeElement()` - Remove elements
- `CommandFactory.executeScript()` - Execute custom scripts
- `CommandFactory.clearCanvas()` - Clear canvas
- `CommandFactory.set3DFocus()` - Control 3D focus

### Agent Simulation Examples
- **simulateManagerAgent()** - Orchestrates learning sequences
- **simulateCanvasAgent()** - Creates interactive visualizations
- **demonstrate3DFocus()** - Shows 3D camera control

### Element Tracking
The server maintains a `canvasElements` Map to track all active elements and their states for consistency.

## Frontend Integration

The frontend Canvas Manager should handle:

1. **Command Parsing** - Parse incoming JSON commands
2. **Element Rendering** - Create visual elements based on payload data
3. **State Management** - Track element positions, properties, and interactions
4. **Animation Handling** - Process animation directives
5. **3D Scene Control** - Manage camera positioning and model interactions

## Usage Examples

### Educational Sequence
```javascript
// Manager Agent creates a learning sequence
const title = CommandFactory.addText("Solar System Overview", {x: 50, y: 30});
const image = CommandFactory.addImage("solar-system.jpg", {x: 100, y: 100});
const model = CommandFactory.add3DModel("mars.glb", {x: 0, y: 0, z: 0});

// Send commands via WebSocket
ws.send(JSON.stringify(title));
ws.send(JSON.stringify(image));
ws.send(JSON.stringify(model));
```

### Interactive Updates
```javascript
// Update text content based on user interaction
const update = CommandFactory.updateElement(
  "text-uuid-12345", 
  "text", 
  { content: "Mars: The Red Planet", styles: { color: "#d63031" } }
);
ws.send(JSON.stringify(update));
```

### Custom Visualizations
```javascript
// Canvas Agent draws orbital paths
const script = CommandFactory.executeScript(`
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(400, 300, 50 + i * 30, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.stroke();
  }
`, "animation", true);
ws.send(JSON.stringify(script));
```

This protocol enables sophisticated multi-agent coordination for creating dynamic, educational, and interactive canvas experiences.
