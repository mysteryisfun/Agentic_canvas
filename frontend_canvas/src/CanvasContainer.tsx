import React from 'react';
import CanvasManager from './components/CanvasManager';
import UnifiedCanvas from './UnifiedCanvas';

const CanvasContainer: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#1a1a1a',
    }}>
      <CanvasManager wsUrl="ws://localhost:8080/canvas">
        <UnifiedCanvas />
      </CanvasManager>
    </div>
  );
};

export default CanvasContainer;