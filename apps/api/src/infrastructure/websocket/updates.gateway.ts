// ─── WebSocket Gateway — Real-time updates via pg_notify ───

import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface WsClient {
  socket: Socket;
  familyId: string | null;
  userId: string | null;
}

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/updates' })
export class UpdatesGateway implements OnGatewayConnection {
  private readonly logger = new Logger(UpdatesGateway.name);
  private clients = new Map<string, WsClient>();

  @WebSocketServer() server!: Server;

  handleConnection(client: Socket): void {
    this.clients.set(client.id, { socket: client, familyId: null, userId: null });
    this.logger.log(`Client connected: ${client.id} (total: ${this.clients.size})`);
    
    client.on('disconnect', () => {
      this.clients.delete(client.id);
      this.logger.log(`Client disconnected: ${client.id} (total: ${this.clients.size})`);
    });
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { familyId: string; userId: string }): void {
    const existing = this.clients.get(client.id);
    if (existing) {
      existing.familyId = payload.familyId;
      existing.userId = payload.userId;
    }
    client.emit('subscribed', { familyId: payload.familyId });
  }

  /** Broadcast to all clients in a family */
  notifyFamily(familyId: string, event: string, data: unknown): void {
    let count = 0;
    for (const c of this.clients.values()) {
      if (c.familyId === familyId) {
        c.socket.emit(event, data);
        count++;
      }
    }
    if (count > 0) {
      this.logger.debug(`Notified ${count} clients in family ${familyId}: ${event}`);
    }
  }

  /** Broadcast to specific user */
  notifyUser(userId: string, event: string, data: unknown): void {
    for (const c of this.clients.values()) {
      if (c.userId === userId) {
        c.socket.emit(event, data);
      }
    }
  }
}
