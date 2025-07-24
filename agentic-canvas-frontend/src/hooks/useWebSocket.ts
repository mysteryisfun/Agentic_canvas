import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useCanvas } from '../context/CanvasContext';
import type { WebSocketCommand, AddElementPayload, UpdateElementPayload, RemoveElementPayload } from '../types.ts';

const WEBSOCKET_URL = 'http://localhost:3001'; // Example URL, should be configurable

export const useWebSocket = () => {
  const { addElement, updateElement, removeElement, clearCanvas } = useCanvas();

  useEffect(() => {
    const socket: Socket = io(WEBSOCKET_URL);

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('command', (command: WebSocketCommand) => {
      console.log('Received command:', command);
      switch (command.command) {
        case 'ADD_ELEMENT':
          addElement(command.payload as AddElementPayload);
          break;
        case 'UPDATE_ELEMENT':
          const updatePayload = command.payload as UpdateElementPayload;
          updateElement(updatePayload.id, updatePayload.updates);
          break;
        case 'REMOVE_ELEMENT':
          const removePayload = command.payload as RemoveElementPayload;
          removeElement(removePayload.id);
          break;
        case 'CLEAR_CANVAS':
          clearCanvas();
          break;
        // case 'UPDATE_3D_CAMERA':
        //   // This will be handled in a later phase
        //   break;
        default:
          console.warn('Unknown command received:', command);
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [addElement, updateElement, removeElement, clearCanvas]);
};
