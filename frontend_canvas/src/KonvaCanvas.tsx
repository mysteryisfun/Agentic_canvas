import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

const KonvaCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        
        // Maintain 16:9 aspect ratio
        let width = containerWidth;
        let height = containerWidth * 9 / 16;

        if (height > containerHeight) {
          height = containerHeight;
          width = containerHeight * 16 / 9;
        }

        setSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div ref={containerRef} style={{ width: '80vw', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Stage width={size.width} height={size.height} style={{ position: 'relative', zIndex: 2 }}>
        <Layer>
          <Rect
            x={20}
            y={20}
            width={100}
            height={100}
            fill="red"
            shadowBlur={5}
          />
          <Text text="Hello from Konva" x={150} y={50} />
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaCanvas;
