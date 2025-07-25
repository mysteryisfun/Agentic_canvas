# 🚀 Multi-Agent Canvas System

A real-time, interactive canvas system designed for multi-agent environments with WebSocket communication, supporting both 2D and 3D rendering capabilities.

## 🌟 Features

### Core Canvas Features
- **🎨 Unified 2D/3D Canvas**: Switch between Konva (2D) and Three.js (3D) rendering
- **📡 Real-time WebSocket Communication**: Live updates from backend agents
- **🤖 Multi-Agent Support**: Multiple agents can control canvas elements simultaneously
- **🎯 Interactive Elements**: Draggable, focusable, and updateable canvas objects
- **📏 Grid System**: Customizable grid overlay for precise positioning
- **🔍 Element Inspector**: Detailed information about focused elements

### Agent Communication Protocol
- **JSON Command Structure**: Standardized command format for agent-canvas communication
- **Real-time Updates**: Instant synchronization across all connected clients
- **Secure Script Execution**: Controlled JavaScript execution environment
- **Element Management**: Create, update, delete, and focus canvas elements

### Supported Element Types
- **📝 Text Elements**: Rich text with customizable fonts and colors
- **🔷 Shape Elements**: Rectangles, circles, and custom shapes
- **📦 3D Models**: Three.js 3D objects with materials and animations
- **🤖 Agent Widgets**: Special UI components representing active agents
- **🖼️ Image Elements**: Image rendering and manipulation (ready for implementation)
- **🎥 Video Elements**: Video playback and controls (ready for implementation)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Canvas                         │
├─────────────────┬─────────────────┬─────────────────────────┤
│   CanvasManager │  WebSocket      │  Element Renderers      │
│   (State)       │  Service        │  (2D/3D)               │
├─────────────────┼─────────────────┼─────────────────────────┤
│                 │                 │                         │
│  • Elements[]   │  • Commands     │  • KonvaCanvas (2D)     │
│  • Agents[]     │  • Real-time    │  • ThreeCanvas (3D)     │
│  • Focus State  │  • Reconnect    │  • Element Types        │
│                 │                 │                         │
└─────────────────┴─────────────────┴─────────────────────────┘
                            │
                    ⚡ WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                Backend Canvas Agent                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  • WebSocket Server (Port 8080)                           │
│  • Command Processing                                      │
│  • Agent Activity Simulation                              │
│  • Multi-client Synchronization                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### 1. Setup Frontend
```bash
cd frontend_canvas
npm install
npm run dev
```

### 2. Setup Backend
```bash
cd backend
npm install
npm start
```

### 3. Open Browser
Navigate to `http://localhost:5173` and start testing!

## 🧪 Test Cases & Demo

The system includes several built-in test cases to demonstrate functionality:

### Manual Test Cases
1. **📝 Create Text Element**: Click "Text" button to add interactive text
2. **🔷 Create Shape Element**: Click "Shape" button to add colored rectangles
3. **📦 Create 3D Model**: Click "3D Model" button to add rotating 3D objects
4. **🤖 Create Agent Widget**: Click "Agent" button to add agent representations
5. **🎯 Element Focus**: Click any element to inspect its properties
6. **🎨 Canvas Mode Switch**: Toggle between 2D and 3D views
7. **📏 Grid Controls**: Show/hide grid and adjust size

### Automated Test Cases (Backend)
The backend server automatically simulates agent activities:
- **Agent Registration**: New agents connect and announce themselves
- **Element Creation**: Agents create various element types
- **Real-time Updates**: Elements update positions and properties
- **Status Broadcasting**: Agents share their current status

### WebSocket Command Examples

#### Create Text Element
```json
{
  "id": "cmd-123",
  "type": "render",
  "agentId": "teacher-agent",
  "timestamp": 1640995200000,
  "data": {
    "id": "text-element-1",
    "type": "text",
    "position": { "x": 100, "y": 100 },
    "size": { "width": 200, "height": 40 },
    "content": {
      "text": "Hello from Agent!",
      "fontSize": 16,
      "color": "#4a9eff"
    },
    "isVisible": true,
    "isInteractive": true,
    "zIndex": 1
  }
}
```

#### Update Element Position
```json
{
  "id": "cmd-124",
  "type": "update",
  "agentId": "teacher-agent",
  "timestamp": 1640995210000,
  "data": {
    "elementId": "text-element-1",
    "position": { "x": 150, "y": 120 }
  }
}
```

#### Focus Element
```json
{
  "id": "cmd-125",
  "type": "focus",
  "agentId": "teacher-agent",
  "timestamp": 1640995220000,
  "data": {
    "elementId": "text-element-1"
  }
}
```

#### Execute Custom Script
```json
{
  "id": "cmd-126",
  "type": "execute",
  "agentId": "teacher-agent",
  "timestamp": 1640995230000,
  "data": {
    "script": "addElement({ type: 'text', position: { x: 200, y: 200 }, size: { width: 100, height: 30 }, content: { text: 'Dynamic!', fontSize: 14, color: '#51cf66' }, agentId: 'script-agent', metadata: {}, isVisible: true, isInteractive: true, zIndex: 1 });"
  }
}
```

## 🔧 Configuration

### WebSocket Connection
Default: `ws://localhost:8080/canvas`

To change the WebSocket URL, modify `CanvasContainer.tsx`:
```tsx
<CanvasManager wsUrl="ws://your-server:port/canvas">
```

### Canvas Settings
- **Grid Size**: Adjustable from 10px to 50px
- **Canvas Mode**: 2D (Konva) or 3D (Three.js)
- **Element Limits**: No hard limits (performance dependent)

## 🛠️ Development

### Adding New Element Types

1. **Define Type in WebSocket Service**:
```typescript
// In CanvasWebSocketService.ts
export interface CanvasElement {
  // ... existing properties
  type: 'text' | 'image' | 'video' | '3d-model' | 'shape' | 'agent-widget' | 'your-new-type';
}
```

2. **Add Renderer in KonvaCanvas**:
```tsx
// In KonvaCanvas.tsx
case 'your-new-type':
  return (
    <YourCustomKonvaComponent
      key={element.id}
      element={element}
      // ... props
    />
  );
```

3. **Add Test Button**:
```tsx
// In UnifiedCanvas.tsx
const createTestYourType = () => {
  addElement({
    type: 'your-new-type',
    // ... element data
  });
};
```

### Adding Agent Capabilities

1. **Extend Command Types**:
```typescript
// In CanvasWebSocketService.ts
export interface CanvasCommand {
  type: 'render' | 'update' | 'delete' | 'focus' | 'execute' | 'your-command';
  // ... other properties
}
```

2. **Handle in CanvasManager**:
```tsx
// In CanvasManager.tsx
case 'your-command':
  handleYourCommand(command);
  break;
```

## 🎯 Use Cases

### Educational Applications
- **Interactive Lessons**: Teachers control content delivery through agents
- **Student Collaboration**: Multiple students interact with shared canvas
- **Visual Learning**: 3D models and animations enhance understanding

### Business Applications
- **Team Dashboards**: Real-time data visualization from multiple sources
- **Collaborative Design**: Multiple designers work on shared visual space
- **Process Monitoring**: Agents represent different system components

### Research Applications
- **Multi-Agent Simulations**: Visualize agent behaviors and interactions
- **Data Analysis**: Dynamic charts and graphs from analysis agents
- **Experiment Control**: Researchers control parameters through canvas interface

## 🔜 Future Enhancements

- **🖼️ Image Element Support**: Upload, resize, and manipulate images
- **🎥 Video Element Support**: Video playback with agent-controlled timing
- **🎮 Animation System**: Keyframe animations and transitions
- **💾 Persistent Storage**: Save and load canvas states
- **🔐 Authentication**: User and agent authentication system
- **📊 Analytics**: Usage tracking and performance metrics
- **🎨 Themes**: Customizable canvas appearance
- **📱 Mobile Support**: Touch-friendly interface for tablets and phones

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**🌟 Ready to build the future of multi-agent collaboration!** 🌟
