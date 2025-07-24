// src/components/TextElement.tsx
import React from 'react';
import { CanvasElement } from '../types.ts';

interface TextElementProps {
  element: CanvasElement;
}

const TextElement: React.FC<TextElementProps> = ({ element }) => {
  const { position, size, content } = element;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    color: 'white',
    fontSize: '16px',
    border: '1px dashed #555', // For visualization
    padding: '5px',
    boxSizing: 'border-box',
  };

  return (
    <div style={style}>
      {content}
    </div>
  );
};

export default TextElement;
