// src/components/ImageElement.tsx
import React from 'react';
import { CanvasElement } from '../types.ts';

interface ImageElementProps {
  element: CanvasElement;
}

const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
  const { position, size, content } = element;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    border: '1px dashed #555', // For visualization
  };

  return (
    <img
      src={content}
      style={style}
      alt={`Canvas element ${element.id}`}
    />
  );
};

export default ImageElement;
