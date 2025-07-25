import React, { useState, useEffect, useRef, useCallback } from 'react';
import CanvasWebSocketService from '../services/CanvasWebSocketService';
import type { CanvasCommand, CanvasElement, Agent } from '../services/CanvasWebSocketService';

interface CanvasManagerProps {
  children: React.ReactNode;
  wsUrl?: string;
}

// Canvas Context for sharing state across components
export const CanvasContext = React.createContext<{
  elements: CanvasElement[];
  agents: Agent[];
  focusedElement: string | null;
  isConnected: boolean;
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  focusElement: (id: string) => void;
  executeScript: (script: string, elementType?: 'drawing' | 'animation' | 'interaction') => void;
  sendCommand: (command: CanvasCommand) => void;
  clearCanvas: () => void;
} | null>(null);

const CanvasManager: React.FC<CanvasManagerProps> = ({ 
  children, 
  wsUrl = 'ws://localhost:8082/canvas' 
}) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const wsService = useRef<CanvasWebSocketService | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    wsService.current = new CanvasWebSocketService(wsUrl);
    
    wsService.current.onCommand = handleCommand;
    wsService.current.onAgentUpdate = (newAgents: Agent[]) => {
      setAgents(newAgents);
    };
    wsService.current.onConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
    };

    return () => {
      wsService.current?.disconnect();
    };
  }, [wsUrl]);

  // Handle incoming WebSocket commands
  const handleCommand = useCallback((command: CanvasCommand) => {
    console.log('🎯 Processing command:', command.commandType, command.elementId);
    
    switch (command.commandType) {
      case 'addElement':
        handleAddElementCommand(command);
        break;
      case 'updateElement':
        handleUpdateElementCommand(command);
        break;
      case 'removeElement':
        handleRemoveElementCommand(command);
        break;
      case 'executeScript':
        handleExecuteScriptCommand(command);
        break;
      case 'clearCanvas':
        handleClearCanvasCommand();
        break;
      case 'set3DFocus':
        handleSet3DFocusCommand(command);
        break;
      default:
        console.warn('❓ Unknown command type:', command.commandType);
    }
  }, []);

  const handleAddElementCommand = (command: CanvasCommand) => {
    const newElement: CanvasElement = {
      id: command.elementId,
      type: command.payload.elementType as CanvasElement['type'] || 'text',
      position: command.payload.position || { x: 0, y: 0 },
      size: command.payload.size || { width: 100, height: 100 },
      content: {
        text: command.payload.content,
        url: command.payload.url,
        modelUrl: command.payload.modelUrl,
        styles: command.payload.styles,
        opacity: command.payload.opacity,
        animation: command.payload.animation,
        autoplay: command.payload.autoplay,
        loop: command.payload.loop,
        controls: command.payload.controls,
        rotation: command.payload.rotation,
        scale: command.payload.scale,
        environmentMapUrl: command.payload.environmentMapUrl
      },
      agentId: 'system', // Default agent
      metadata: {},
      isVisible: true,
      isInteractive: command.payload.isInteractive !== false,
      zIndex: 1,
      timestamp: command.timestamp
    };
    
    setElements(prev => [...prev, newElement]);
    console.log('✨ Added new element:', newElement.type, newElement.id);
  };

  const handleUpdateElementCommand = (command: CanvasCommand) => {
    setElements(prev => 
      prev.map(el => 
        el.id === command.elementId ? { 
          ...el, 
          content: { ...el.content, ...command.payload },
          position: command.payload.position || el.position,
          size: command.payload.size || el.size,
          timestamp: command.timestamp
        } : el
      )
    );
    console.log('🔄 Updated element:', command.elementId);
  };

  const handleRemoveElementCommand = (command: CanvasCommand) => {
    setElements(prev => prev.filter(el => el.id !== command.elementId));
    console.log('🗑️ Removed element:', command.elementId);
  };

  const handleExecuteScriptCommand = (command: CanvasCommand) => {
    const script = command.payload.scriptCode;
    if (!script) return;
    
    try {
      // Create a safe execution context
      const safeEval = new Function('canvas', 'document', 'console', script);
      const canvas = document.querySelector('canvas');
      safeEval(canvas, document, console);
      console.log('✅ Executed script successfully');
    } catch (error) {
      console.error('❌ Script execution error:', error);
    }
  };

  const handleClearCanvasCommand = () => {
    setElements([]);
    console.log('🧹 Cleared canvas');
  };

  const handleSet3DFocusCommand = (command: CanvasCommand) => {
    setFocusedElement(command.elementId);
    // Additional 3D focus logic would go here
    console.log('🎯 Set 3D focus:', command.elementId, command.payload.focusType);
  };

  // Canvas manipulation functions
  const addElement = useCallback((elementData: Omit<CanvasElement, 'id'>) => {
    const newElement: CanvasElement = {
      ...elementData,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setElements(prev => [...prev, newElement]);
    return newElement.id;
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => 
      prev.map(el => 
        el.id === id ? { ...el, ...updates } : el
      )
    );
    
    // Notify backend of local changes
    if (wsService.current && updates.type) {
      wsService.current.sendElementUpdate(id, updates.type, updates);
    }
  }, []);

  const removeElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    
    // Notify backend
    if (wsService.current) {
      wsService.current.removeElement(id);
    }
  }, []);

  const focusElement = useCallback((id: string) => {
    setFocusedElement(id);
    
    // Notify backend of focus change
    if (wsService.current) {
      wsService.current.sendFocusRequest(id, 'cameraLookAt');
    }
  }, []);

  const executeScript = useCallback((script: string, elementType: 'drawing' | 'animation' | 'interaction' = 'drawing') => {
    if (wsService.current) {
      wsService.current.executeCustomScript(script, elementType);
    }
  }, []);

  const sendCommand = useCallback((command: CanvasCommand) => {
    if (wsService.current) {
      wsService.current.send(command);
    }
  }, []);

  const clearCanvas = useCallback(() => {
    if (wsService.current) {
      wsService.current.clearCanvas();
    }
  }, []);

  // Context value
  const contextValue = {
    elements,
    agents,
    focusedElement,
    isConnected,
    addElement,
    updateElement,
    removeElement,
    focusElement,
    executeScript,
    sendCommand,
    clearCanvas
  };

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasManager;
