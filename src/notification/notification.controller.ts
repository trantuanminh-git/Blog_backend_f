import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { AtGuard } from 'src/common/guards/at.guard';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/roles.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(AtGuard)
  create(userId: number, notification: CreateNotificationDto) {
    return this.notificationService.create(0, notification); //use admin guard
  }

  @Get()
  @UseGuards(AtGuard)
  getAllNotification(@GetCurrentUserId() userId: number) {
    return this.notificationService.findNotificationsByUserId(userId);
  }

  @Get(':id')
  @UseGuards(AtGuard)
  getOne(@Param('id') id: string, @GetCurrentUserId() userId: number) {
    return this.notificationService.getOne(+id, userId);
  }

  @Put('markAll')
  @UseGuards(AtGuard)
  markAllNotification(@GetCurrentUserId() userId: number) {
    return this.notificationService.markNotificationsAsRead(userId);
  }

  @Put(':id')
  @UseGuards(AtGuard)
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.notificationService.update(+id, updateNotificationDto, userId);
  }

  @Delete(':id')
  @UseGuards(AtGuard)
  remove(@Param('id') id: string, @GetCurrentUserId() userId: number) {
    return this.notificationService.remove(+id, userId);
  }
}
