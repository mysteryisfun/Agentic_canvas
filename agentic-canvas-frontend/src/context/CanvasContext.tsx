import React, { createContext, useState, ReactNode, useContext } from 'react';
import type { CanvasElement } from '../types.ts';

// Define the shape of the context state
interface CanvasState {
  elements: CanvasElement[];
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  clearCanvas: () => void;
}

// Create the context with a default undefined value
const CanvasContext = createContext<CanvasState | undefined>(undefined);

// Create the provider component
export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const addElement = (element: CanvasElement) => {
    setElements(prev => [...prev, element]);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const removeElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
  };

  const clearCanvas = () => {
    setElements([]);
  };

  const value = {
    elements,
    addElement,
    updateElement,
    removeElement,
    clearCanvas,
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

// Custom hook to use the CanvasContext
export const useCanvas = (): CanvasState => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
