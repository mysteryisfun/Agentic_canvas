// src/types.ts

// Defines the possible types for a canvas element
export type ElementType = 'text' | 'image' | 'video' | '3d_model' | 'js_animation';

// Base interface for all canvas elements
export interface CanvasElement {
  id: string;
  type: ElementType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: any; // Can be string (text, URL, JS code) or other data
  options?: Record<string, any>; // For additional properties
}

// --- Command Payloads ---

export interface AddElementPayload {
  id: string;
  type: ElementType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: any;
  options?: Record<string, any>;
}

export interface UpdateElementPayload {
  id: string;
  updates: Partial<CanvasElement>;
}

export interface RemoveElementPayload {
  id: string;
}

export interface Update3DCameraPayload {
  id: string; // ID of the 3D model element
  cameraPosition?: [number, number, number];
  lookAt?: [number, number, number];
}

// --- WebSocket Command Structure ---

export type CommandType = 'ADD_ELEMENT' | 'UPDATE_ELEMENT' | 'REMOVE_ELEMENT' | 'CLEAR_CANVAS' | 'UPDATE_3D_CAMERA';

export interface WebSocketCommand {
  command: CommandType;
  payload: AddElementPayload | UpdateElementPayload | RemoveElementPayload | Update3DCameraPayload | null;
}
