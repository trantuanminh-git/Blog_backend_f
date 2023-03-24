import { WsGuard } from './../common/guards/ws.guard';
import { UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BlogService } from 'src/blog/blog.service';
import { User } from 'src/user/entities/user.entity';
@WebSocketGateway({ cors : true})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private blogService: BlogService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('notification')
  receivedAndSendNotificationToUser(client: Socket, message: string): void {
    console.log("server received notification")
    const data = message.split(' ', 2);

    const userId = this.blogService.findUserIdByBlogId(parseInt(data[1]))
    // this.server.on(`client_${client.id}`).emit('notification', message);
    const noti = `You have one ${data[1]}`;
    this.server.to(`client_${userId}`).emit('notification', noti);
  }
}
