import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendNotificationToUser(userId: number, message: string): void {
    this.server.to(`user_${userId}`).emit('notification', message);
  }
}
