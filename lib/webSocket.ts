import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer;

export const initializeWebSocket = (server: Server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (_ws) => {
    console.log('Client connected');
  });
};

export const broadcastMessage = (message: string) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
