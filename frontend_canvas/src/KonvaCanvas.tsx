import React, { useRef, useEffect, useState, useContext } from 'react';
import { Stage, Layer, Line, Rect, Text, Circle } from 'react-konva';
import { CanvasContext } from './components/CanvasManager';

const KonvaCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const canvasContext = useContext(CanvasContext);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!canvasContext) {
    return <div>Canvas context not available</div>;
  }

  const { elements, focusedElement, updateElement } = canvasContext;
  const gridSize = 20;
  const lines = [];

  // Create grid lines
  for (let i = 0; i < size.width / gridSize; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[Math.round(i * gridSize) + 0.5, 0, Math.round(i * gridSize) + 0.5, size.height]}
        stroke="#333"
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  for (let i = 0; i < size.height / gridSize; i++) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[0, Math.round(i * gridSize) + 0.5, size.width, Math.round(i * gridSize) + 0.5]}
        stroke="#333"
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  // Filter 2D elements
  const visible2DElements = elements.filter(el => 
    el.isVisible && 
    el.type !== '3d-model' && 
    !el.metadata.renderIn3D
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Stage width={size.width} height={size.height}>
        {/* Grid Layer */}
        <Layer>
          {lines}
        </Layer>
        
        {/* Elements Layer */}
        <Layer>
          {visible2DElements.map((element) => {
            const isFocused = element.id === focusedElement;
            const strokeColor = isFocused ? '#ffd93d' : '#4a9eff';
            const strokeWidth = isFocused ? 3 : 1;
            
            switch (element.type) {
              case 'text':
                return (
                  <React.Fragment key={element.id}>
                    <Rect
                      x={element.position.x - 5}
                      y={element.position.y - 5}
                      width={element.size.width + 10}
                      height={element.size.height + 10}
                      fill="rgba(0, 0, 0, 0.7)"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      cornerRadius={5}
                    />
                    <Text
                      x={element.position.x}
                      y={element.position.y}
                      text={element.content.text}
                      fontSize={element.content.fontSize || 16}
                      fill={element.content.color || '#ffffff'}
                      width={element.size.width}
                      height={element.size.height}
                      draggable={element.isInteractive}
                      onDragEnd={(e) => {
                        updateElement(element.id, {
                          position: { x: e.target.x(), y: e.target.y() }
                        });
                      }}
                    />
                  </React.Fragment>
                );

              case 'shape':
                if (element.content.shape === 'rectangle') {
                  return (
                    <Rect
                      key={element.id}
                      x={element.position.x}
                      y={element.position.y}
                      width={element.size.width}
                      height={element.size.height}
                      fill={element.content.fill || '#4a9eff'}
                      stroke={element.content.stroke || strokeColor}
                      strokeWidth={element.content.strokeWidth || strokeWidth}
                      draggable={element.isInteractive}
                      onDragEnd={(e) => {
                        updateElement(element.id, {
                          position: { x: e.target.x(), y: e.target.y() }
                        });
                      }}
                    />
                  );
                }
                return null;

              case 'agent-widget':
                return (
                  <React.Fragment key={element.id}>
                    <Rect
                      x={element.position.x}
                      y={element.position.y}
                      width={element.size.width}
                      height={element.size.height}
                      fill={element.content.color || '#2a2a2a'}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      cornerRadius={8}
                      draggable={element.isInteractive}
                      onDragEnd={(e) => {
                        updateElement(element.id, {
                          position: { x: e.target.x(), y: e.target.y() }
                        });
                      }}
                    />
                    <Text
                      x={element.position.x + 10}
                      y={element.position.y + 10}
                      text={element.content.agentName}
                      fontSize={12}
                      fill="#ffffff"
                      fontStyle="bold"
                    />
                    <Circle
                      x={element.position.x + element.size.width - 15}
                      y={element.position.y + 15}
                      radius={5}
                      fill={element.content.status === 'active' ? '#51cf66' : '#ff6b6b'}
                    />
                    <Text
                      x={element.position.x + 10}
                      y={element.position.y + 30}
                      text={element.content.lastMessage}
                      fontSize={10}
                      fill="#aaaaaa"
                      width={element.size.width - 20}
                    />
                  </React.Fragment>
                );

              default:
                return (
                  <Rect
                    key={element.id}
                    x={element.position.x}
                    y={element.position.y}
                    width={element.size.width}
                    height={element.size.height}
                    fill="rgba(255, 255, 255, 0.1)"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    dash={[5, 5]}
                    draggable={element.isInteractive}
                  />
                );
            }
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaCanvas;
