import React, { useState } from 'react';
import ThreeCanvas from './ThreeCanvas';
import InfoPanel from './InfoPanel';

const CanvasContainer: React.FC = () => {
  const [cameraAnimateCallback, setCameraAnimateCallback] = useState<((target: { x: number; y: number; z: number }, zoom: number) => void) | null>(null);

  const addElement = () => {
    // This will be reimplemented to add elements to the Konva or Three.js canvas
    console.log('Add element clicked');
  };

  const handleCameraUpdate = (target: { x: number; y: number; z: number }, zoom: number) => {
    if (cameraAnimateCallback) {
      cameraAnimateCallback(target, zoom);
    }
  };

  const handleCameraCallbackSet = (callback: (target: { x: number; y: number; z: number }, zoom: number) => void) => {
    setCameraAnimateCallback(() => callback);
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      position: 'relative',
      backgroundColor: '#1a1a1a',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1000, // High z-index to be on top of everything
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Agentic Canvas</h1>
        <button 
          onClick={addElement}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4a9eff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Agent
        </button>
      </div>

      {/* Canvas Container */}
      <div style={{
        width: '80vw',
        height: '80vh',
        position: 'relative',
        border: '2px solid #333',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <ThreeCanvas onCameraUpdate={handleCameraCallbackSet} />
        {/* Info Panel now inside canvas */}
        <InfoPanel onCameraUpdate={handleCameraUpdate} />
      </div>

    </div>
  );
};

export default CanvasContainer;