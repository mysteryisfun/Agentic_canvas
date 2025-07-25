import React, { useState, useEffect } from 'react';
import ThreeCanvas from './ThreeCanvas';
import InfoPanel from './InfoPanel';

const CanvasContainer: React.FC = () => {
  const [cameraAnimateCallback, setCameraAnimateCallback] = useState<((target: { x: number; y: number; z: number }, zoom: number) => void) | null>(null);
  const [is3dViewVisible, setIs3dViewVisible] = useState(true);
  const [currentStep] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(false);

  // Educational logic: when to show 3D vs 2D
  const educationalSteps = [
    { step: 0, mode: '3D', reason: 'Overview - show full solar system in 3D' },
    { step: 1, mode: '3D+2D', reason: 'Sun - 3D view with 2D ray animations' },
    { step: 2, mode: '3D+2D', reason: 'Mercury - 3D planet with 2D speed lines' },
    { step: 3, mode: '3D+2D', reason: 'Venus - 3D view with 2D spin animation' },
    { step: 4, mode: '3D+2D', reason: 'Earth - 3D view with 2D rotation animation' },
    { step: 5, mode: '3D+2D', reason: 'Mars - 3D view with 2D dust storm animation' },
    { step: 6, mode: '3D+2D', reason: 'Jupiter - 3D view with 2D storm animation' },
    { step: 7, mode: '3D+2D', reason: 'Saturn - 3D view with 2D ring animation' },
    { step: 8, mode: '3D+2D', reason: 'Uranus - 3D view with 2D sideways rotation' },
    { step: 9, mode: '3D+2D', reason: 'Neptune - 3D view with 2D wind animation' },
    { step: 10, mode: '2D', reason: 'Celebration - 2D animations and summary' }
  ];

  // Auto-adjust view based on educational content
  useEffect(() => {
    const currentMode = educationalSteps[currentStep]?.mode || '3D+2D';
    
    if (currentMode === '2D') {
      setIs3dViewVisible(false);
    } else {
      setIs3dViewVisible(true);
    }
    
    console.log(`Step ${currentStep}: ${educationalSteps[currentStep]?.reason}`);
  }, [currentStep]);

  const addElement = () => {
    console.log('Add element clicked - Future: Add interactive elements to canvas');
  };

  const handleCameraUpdate = (target: { x: number; y: number; z: number }, zoom: number) => {
    if (cameraAnimateCallback) {
      cameraAnimateCallback(target, zoom);
    }
  };

  const handleCameraCallbackSet = (callback: (target: { x: number; y: number; z: number }, zoom: number) => void) => {
    setCameraAnimateCallback(() => callback);
  };

  const toggle3dView = () => {
    setIs3dViewVisible(prev => !prev);
  };

  const toggleAutoMode = () => {
    setIsAutoMode(prev => !prev);
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Educational Header */}
      <div style={{
        padding: '20px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        borderBottom: '1px solid #333',
        background: 'linear-gradient(90deg, #1a1a1a, #2a2a2a, #1a1a1a)'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#4a9eff' }}>
          🚀 Interactive Solar System Classroom
        </h1>
        <div style={{ fontSize: '12px', color: '#aaa' }}>
          For 4th & 5th Grade Space Explorers
        </div>
        
        <button
          onClick={addElement}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4a9eff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🌟 Add Element
        </button>
        
        <button
          onClick={toggleAutoMode}
          style={{
            padding: '8px 16px',
            backgroundColor: isAutoMode ? '#ff6b6b' : '#51cf66',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {isAutoMode ? '⏸️ Teacher Mode' : '🎮 Auto Mode'}
        </button>
        
        <button
          onClick={toggle3dView}
          style={{
            padding: '8px 16px',
            backgroundColor: '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: 'auto',
            fontSize: '12px'
          }}
        >
          {is3dViewVisible ? '🎨 Show 2D Only' : '🌌 Show 3D View'}
        </button>
      </div>

      {/* Educational Status Bar */}
      <div style={{
        padding: '10px 20px',
        backgroundColor: '#2a2a2a',
        fontSize: '12px',
        color: '#4a9eff',
        borderBottom: '1px solid #333'
      }}>
        📚 Current Lesson: {educationalSteps[currentStep]?.reason || 'Exploring...'}
        {isAutoMode && ' • 🤖 Auto Mode Active'}
      </div>

      {/* Main Educational Content */}
      <div style={{
        display: 'flex',
        height: '500px',
        maxHeight: '500px',
        overflow: 'hidden',
        margin: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(74, 158, 255, 0.2)'
      }}>
        {/* 3D Canvas Container */}
        {is3dViewVisible && (
          <div style={{
            flex: '1 1 70%',
            height: '100%',
            position: 'relative',
            borderRight: '1px solid #333',
            overflow: 'hidden',
            background: 'radial-gradient(circle at center, #0a0a1a, #000000)'
          }}>
            <ThreeCanvas onCameraUpdate={handleCameraCallbackSet} />
            
            {/* 3D View Label */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '12px',
              color: '#4a9eff'
            }}>
              🌌 3D Solar System View
            </div>
          </div>
        )}

        {/* 2D Info Panel Container */}
        <div style={{
          flex: is3dViewVisible ? '1 1 30%' : '1 1 100%',
          height: '100%',
          overflowY: 'auto',
          backgroundColor: '#242424',
          boxSizing: 'border-box',
          borderRadius: is3dViewVisible ? '0 10px 10px 0' : '10px'
        }}>
          {/* 2D View Label */}
          <div style={{
            position: 'sticky',
            top: '0',
            background: '#333',
            padding: '8px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#4a9eff',
            borderBottom: '1px solid #444'
          }}>
            📖 Interactive Learning Panel
          </div>
          
          <InfoPanel onCameraUpdate={handleCameraUpdate} />
        </div>
      </div>

      {/* Educational Footer */}
      <div style={{
        padding: '15px 20px',
        borderTop: '1px solid #333',
        backgroundColor: '#2a2a2a',
        textAlign: 'center',
        fontSize: '12px',
        color: '#aaa'
      }}>
        🎓 Interactive Solar System Learning Experience • 
        Designed for Young Space Explorers • 
        🌟 Combining 3D Visualization with 2D Animations
      </div>
    </div>
  );
};

export default CanvasContainer;