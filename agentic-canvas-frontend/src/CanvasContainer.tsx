import React from 'react';
import { useCanvas } from '../context/CanvasContext.ts';
import { useWebSocket } from '../hooks/useWebSocket.ts';
import TextElement from './components/TextElement.tsx';
import ImageElement from './components/ImageElement.tsx';
import { CanvasElement } from '../types.ts';

const renderElement = (element: CanvasElement) => {
  switch (element.type) {
    case 'text':
      return <TextElement key={element.id} element={element} />;
    case 'image':
      return <ImageElement key={element.id} element={element} />;
    // Other element types will be added in later phases
    default:
      console.warn(`Unknown element type: ${element.type}`);
      return null;
  }
};

const CanvasContainer: React.FC = () => {
  useWebSocket(); 
  const { elements } = useCanvas();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#1a1a1a' }}>
      {elements.map(element => renderElement(element))}
    </div>
  );
};

export default CanvasContainer;
