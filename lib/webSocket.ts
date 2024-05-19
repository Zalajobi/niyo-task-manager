// import { Server } from 'http';
// import { WebSocket, WebSocketServer as WsServer } from 'ws';
//
// export class WebSocketServer {
//   private wss: WsServer;
//
//   constructor(server: Server) {
//     this.wss = new WsServer({ server });
//
//     this.wss.on('listening', () => {
//       console.log('WebSocket Server Listening...');
//     });
//
//     this.wss.on('error', (err) => {
//       console.error('WebSocket Server Error: ', err);
//     });
//
//     this.wss.on('open', () => {
//       console.log('WebSocket Server Open...');
//     })
//
//     this.wss.on('connection', (ws: WebSocket) => {
//       console.log('Client connected');
//
//       ws.on('close', () => {
//         console.log('Client disconnected');
//       });
//     });
//   }
//
//   broadcast(data: any) {
//     this.wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(data));
//       }
//     });
//   }
// }


// src/lib/websocket.ts
import {WebSocket, WebSocketServer} from 'ws';
import { Server } from 'http';

let wss: WebSocketServer;

export const initializeWebSocket = (server: Server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');
  });
}

export const broadcastMessage = (message: string) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}