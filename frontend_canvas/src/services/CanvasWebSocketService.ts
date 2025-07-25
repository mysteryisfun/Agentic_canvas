// WebSocket service for real-time agent communication
// Updated to support the comprehensive command protocol

export interface CanvasCommand {
  commandType: 'addElement' | 'updateElement' | 'removeElement' | 'executeScript' | 'clearCanvas' | 'set3DFocus';
  elementId: string;
  timestamp: string; // ISO 8601 format
  payload: CanvasCommandPayload;
}

export interface CanvasCommandPayload {
  elementType?: 'text' | 'image' | 'video' | '3dModel' | 'drawing' | 'animation' | 'interaction';
  content?: string;
  url?: string;
  modelUrl?: string;
  position?: { x: number; y: number; z?: number };
  size?: { width: number; height: number; depth?: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  styles?: {
    fontSize?: string;
    color?: string;
    fontFamily?: string;
    fontWeight?: string;
    textAlign?: string;
    width?: string;
  };
  opacity?: number;
  animation?: {
    type: string;
    duration: number;
  };
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  action?: string;
  seekTime?: number;
  scriptCode?: string;
  isPersistent?: boolean;
  focusType?: string;
  targetPosition?: { x: number; y: number; z: number };
  partName?: string;
  animationDuration?: number;
  environmentMapUrl?: string;
  isInteractive?: boolean;
}

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'video' | '3dModel' | 'shape' | 'agent-widget' | 'drawing';
  position: { x: number; y: number; z?: number };
  size: { width: number; height: number; depth?: number };
  content: any;
  agentId?: string;
  metadata: Record<string, any>;
  isVisible: boolean;
  isInteractive: boolean;
  zIndex: number;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  lastSeen: number;
  elements: string[]; // Element IDs owned by this agent
}

class CanvasWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: CanvasCommand[] = [];
  private isConnected = false;
  private url: string;

  // Event handlers
  public onCommand: ((command: CanvasCommand) => void) | null = null;
  public onAgentUpdate: ((agents: Agent[]) => void) | null = null;
  public onConnectionChange: ((connected: boolean) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = () => {
        console.log('🚀 Canvas WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.onConnectionChange?.(true);
        
        // Send queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          if (message) {
            this.send(message);
          }
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const command: CanvasCommand = JSON.parse(event.data);
          this.handleCommand(command);
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 Canvas WebSocket disconnected');
        this.isConnected = false;
        this.onConnectionChange?.(false);
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('❌ Canvas WebSocket error:', error);
      };

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  private handleCommand(command: CanvasCommand) {
    console.log('📨 Received canvas command:', command);
    this.onCommand?.(command);
  }

  public send(command: CanvasCommand) {
    if (this.isConnected && this.ws) {
      this.ws.send(JSON.stringify(command));
    } else {
      // Queue message if not connected
      this.messageQueue.push(command);
      console.log('📤 Queued command (not connected):', command);
    }
  }

  public sendElementUpdate(elementId: string, elementType: string, updates: any) {
    this.send({
      commandType: 'updateElement',
      elementId,
      timestamp: new Date().toISOString(),
      payload: {
        elementType,
        ...updates
      }
    });
  }

  public sendFocusRequest(elementId: string, focusType: string, options: any = {}) {
    this.send({
      commandType: 'set3DFocus',
      elementId,
      timestamp: new Date().toISOString(),
      payload: {
        focusType,
        targetPosition: { x: 0, y: 0, z: 0 },
        animationDuration: 1.0,
        ...options
      }
    });
  }

  public executeCustomScript(
    scriptCode: string, 
    elementType: 'drawing' | 'animation' | 'interaction' = 'drawing', 
    isPersistent: boolean = false
  ) {
    this.send({
      commandType: 'executeScript',
      elementId: `script-${Date.now()}`,
      timestamp: new Date().toISOString(),
      payload: {
        elementType,
        scriptCode,
        isPersistent
      }
    });
  }

  public removeElement(elementId: string) {
    this.send({
      commandType: 'removeElement',
      elementId,
      timestamp: new Date().toISOString(),
      payload: {}
    });
  }

  public clearCanvas() {
    this.send({
      commandType: 'clearCanvas',
      elementId: `clear-${Date.now()}`,
      timestamp: new Date().toISOString(),
      payload: {}
    });
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public getConnectionStatus() {
    return this.isConnected;
  }
}

export default CanvasWebSocketService;
