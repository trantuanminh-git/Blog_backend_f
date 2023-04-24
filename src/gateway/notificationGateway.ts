import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AtGuard } from 'src/common/guards/at.guard';
import { WsGuard } from './guard/ws.guard';
import { UseGuards, HttpException, HttpStatus, ExecutionContext, Req } from '@nestjs/common';
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
import { NotificationService } from 'src/notification/notification.service';
@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private blogService: BlogService,
    private notificationService: NotificationService
    ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('join')
  async clientJoinRoom( client: Socket, userID: string) {
    client.join(`room_${userID}`)
    console.log(`Client join the room: ${client.rooms}`)
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('notification')
  async receivedAndSendNotificationToUser( client: Socket, message: MessageDTO) {
    console.log(message)

    if(message.blogId === undefined || message.userIdSent === undefined) {
        return;
    }    
    
    const userId = await this.blogService.findUserIdByBlogId(message.blogId);
    const notification = await this.notificationService.findCurrentNoti(message.userIdSent, message.blogId, false);
    if(message.userIdSent !== userId) {
      console.log("sent")
      this.server.to(`room_${userId}`).emit(`client_${userId}`, { to: userId, message: notification});
    } else {
      console.log("no send")
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('admin')
  async receivedAndSendNotificationToAdmin(client: Socket, message: MessageDTO) {
    console.log(message)

    if(message.blogId === undefined || message.userIdSent === undefined) {
        return;
    }    
    
    const notification = await this.notificationService.findCurrentNoti(message.userIdSent, message.blogId, true);
    this.server.to("room_admin").emit('sent_admin', notification)
  }
}
