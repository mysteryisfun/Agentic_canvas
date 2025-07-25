import React, { useState, useContext } from 'react';
import { CanvasContext } from './components/CanvasManager';
import ThreeCanvas from './ThreeCanvas';
import KonvaCanvas from './KonvaCanvas';

const UnifiedCanvas: React.FC = () => {
  const [is3D, setIs3D] = useState(true);
  const [gridVisible, setGridVisible] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const canvasContext = useContext(CanvasContext);
  
  if (!canvasContext) {
    throw new Error('UnifiedCanvas must be used within CanvasManager');
  }

  const { 
    elements, 
    agents, 
    focusedElement, 
    isConnected,
    addElement,
    removeElement
  } = canvasContext;

  // Test functions for creating sample elements
  const createTestText = () => {
    addElement({
      type: 'text',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      size: { width: 200, height: 50 },
      content: { text: 'Hello from Agent!', fontSize: 16, color: '#4a9eff' },
      agentId: 'test-agent',
      metadata: { created: Date.now() },
      isVisible: true,
      isInteractive: true,
      zIndex: 1
    });
  };

  const createTestShape = () => {
    addElement({
      type: 'shape',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      size: { width: 100, height: 100 },
      content: { 
        shape: 'rectangle', 
        fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
        stroke: '#fff',
        strokeWidth: 2
      },
      agentId: 'test-agent',
      metadata: { type: 'test-shape' },
      isVisible: true,
      isInteractive: true,
      zIndex: 1
    });
  };

  const createTest3DModel = () => {
    addElement({
      type: '3d-model',
      position: { x: 0, y: 0, z: 0 },
      size: { width: 2, height: 2, depth: 2 },
      content: { 
        geometry: 'box',
        material: { color: '#ff6b6b', wireframe: false },
        animation: 'rotate'
      },
      agentId: 'test-agent-3d',
      metadata: { renderIn3D: true },
      isVisible: true,
      isInteractive: true,
      zIndex: 1
    });
  };

  const createTestAgentWidget = () => {
    addElement({
      type: 'agent-widget',
      position: { x: Math.random() * 300 + 50, y: Math.random() * 200 + 50 },
      size: { width: 150, height: 80 },
      content: {
        agentName: `Agent-${Math.floor(Math.random() * 100)}`,
        status: 'active',
        lastMessage: 'Processing data...',
        color: `hsl(${Math.random() * 360}, 60%, 50%)`
      },
      agentId: `agent-${Date.now()}`,
      metadata: { isAgentRepresentation: true },
      isVisible: true,
      isInteractive: true,
      zIndex: 2
    });
  };

  const clearAllElements = () => {
    elements.forEach(element => removeElement(element.id));
  };

  const connectionStatusColor = isConnected ? '#51cf66' : '#ff6b6b';
  const activeAgentsCount = agents.filter(agent => agent.isActive).length;

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      backgroundColor: '#1a1a1a'
    }}>
      {/* Control Panel */}
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #333',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Canvas Mode Controls */}
        <div style={{ marginBottom: '10px' }}>
          <h4 style={{ color: '#4a9eff', margin: '0 0 8px 0', fontSize: '14px' }}>
            🎨 Canvas Mode
          </h4>
          <button 
            onClick={() => setIs3D(true)}
            style={{
              background: is3D ? '#4a9eff' : 'transparent',
              border: '1px solid #4a9eff',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              marginRight: '5px',
              cursor: 'pointer'
            }}
          >
            🌌 3D
          </button>
          <button 
            onClick={() => setIs3D(false)}
            style={{
              background: !is3D ? '#4a9eff' : 'transparent',
              border: '1px solid #4a9eff',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📐 2D
          </button>
        </div>

        {/* Grid Controls */}
        <div style={{ marginBottom: '10px' }}>
          <h4 style={{ color: '#ffd93d', margin: '0 0 8px 0', fontSize: '14px' }}>
            📏 Grid Settings
          </h4>
          <label style={{ color: 'white', fontSize: '12px', display: 'block', marginBottom: '5px' }}>
            <input 
              type="checkbox" 
              checked={gridVisible}
              onChange={(e) => setGridVisible(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Show Grid
          </label>
          <label style={{ color: 'white', fontSize: '12px', display: 'block' }}>
            Size: 
            <input 
              type="range" 
              min="10" 
              max="50" 
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              style={{ marginLeft: '5px', width: '80px' }}
            />
            {gridSize}px
          </label>
        </div>

        {/* Test Element Creation */}
        <div style={{ marginBottom: '10px' }}>
          <h4 style={{ color: '#51cf66', margin: '0 0 8px 0', fontSize: '14px' }}>
            🧪 Test Elements
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
            <button onClick={createTestText} style={{ ...buttonStyle, fontSize: '10px' }}>
              📝 Text
            </button>
            <button onClick={createTestShape} style={{ ...buttonStyle, fontSize: '10px' }}>
              🔷 Shape
            </button>
            <button onClick={createTest3DModel} style={{ ...buttonStyle, fontSize: '10px' }}>
              📦 3D Model
            </button>
            <button onClick={createTestAgentWidget} style={{ ...buttonStyle, fontSize: '10px' }}>
              🤖 Agent
            </button>
          </div>
          <button 
            onClick={clearAllElements} 
            style={{ 
              ...buttonStyle, 
              background: '#ff6b6b', 
              width: '100%', 
              marginTop: '5px',
              fontSize: '10px'
            }}
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Connection Status */}
        <div>
          <h4 style={{ color: '#ff9f43', margin: '0 0 8px 0', fontSize: '14px' }}>
            🔗 Connection Status
          </h4>
          <div style={{ fontSize: '12px', color: 'white' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '3px' 
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: connectionStatusColor,
                marginRight: '8px'
              }} />
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div>Elements: {elements.length}</div>
            <div>Active Agents: {activeAgentsCount}</div>
            <div>Focused: {focusedElement || 'None'}</div>
          </div>
        </div>
      </div>

      {/* Canvas Rendering */}
      <div style={{ width: '100%', height: '100%' }}>
        {is3D ? 
          <ThreeCanvas /> : 
          <KonvaCanvas />
        }
      </div>

      {/* Element Inspector (when element is focused) */}
      {focusedElement && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: '250px',
          background: 'rgba(0, 0, 0, 0.9)',
          border: '1px solid #4a9eff',
          borderRadius: '8px',
          padding: '15px',
          color: 'white',
          fontSize: '12px',
          zIndex: 1000
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#4a9eff' }}>🔍 Element Inspector</h4>
          {(() => {
            const element = elements.find(el => el.id === focusedElement);
            if (!element) return <div>Element not found</div>;
            
            return (
              <div>
                <div><strong>ID:</strong> {element.id}</div>
                <div><strong>Type:</strong> {element.type}</div>
                <div><strong>Agent:</strong> {element.agentId}</div>
                <div><strong>Position:</strong> ({element.position.x}, {element.position.y})</div>
                <div><strong>Size:</strong> {element.size.width}×{element.size.height}</div>
                <div><strong>Visible:</strong> {element.isVisible ? 'Yes' : 'No'}</div>
                <div><strong>Interactive:</strong> {element.isInteractive ? 'Yes' : 'No'}</div>
                <button 
                  onClick={() => removeElement(element.id)}
                  style={{
                    ...buttonStyle,
                    background: '#ff6b6b',
                    marginTop: '10px',
                    width: '100%'
                  }}
                >
                  🗑️ Delete Element
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  background: 'rgba(74, 158, 255, 0.2)',
  border: '1px solid #4a9eff',
  color: 'white',
  padding: '6px 8px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '11px'
};

export default UnifiedCanvas;