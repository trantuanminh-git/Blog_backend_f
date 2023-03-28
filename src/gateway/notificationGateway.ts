import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AtGuard } from 'src/common/guards/at.guard';
import { WsGuard } from './guard/ws.guard';
import { UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BlogService } from 'src/blog/blog.service';
import { User } from 'src/user/entities/user.entity';
import { MessageDTO } from './dto/message.dto';
@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(private blogService: BlogService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('notification')
  async receivedAndSendNotificationToUser(client: Socket, message: MessageDTO) {
    console.log(message)

    if(message.blogId === undefined || message.userIdSent === undefined) {
        return;
    }    
    
    const userId = await this.blogService.findUserIdByBlogId(message.blogId);
    const noti = `You have new notification`;
    if(message.userIdSent === userId) {
      console.log("sended")
      this.server.to(`client_${userId}`).emit('notification', noti);
    } else {
      console.log("no send")
    }
  }
}
