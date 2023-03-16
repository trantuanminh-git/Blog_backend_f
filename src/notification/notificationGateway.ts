import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendNotificationToUser(userId: number, message: string): void {
    console.log("server send notification")
    this.server.emit(`user_${userId}`, message);
    //this.server.to(`user_${userId}`).emit('notification', message);
  }
}
