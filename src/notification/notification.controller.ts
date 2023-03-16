import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { AtGuard } from 'src/common/guards/at.guard';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(AtGuard)
  create( userId: number,notification: CreateNotificationDto) {
    return this.notificationService.create( 0, notification); //admin
  }

  @Get()
  @UseGuards(AtGuard)
  getAllNotification(@GetCurrentUserId() userId: number) {
    return this.notificationService.findNotificationsByUserId(userId);
  }

  @Get(':id')
  @UseGuards(AtGuard)
  getOne(
    @Param('id') id: string,
    @GetCurrentUserId() userId: number,
    ) {
    return this.notificationService.getOne(+id, userId);
  }

  @Patch(':id')
  @UseGuards(AtGuard)
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @UseGuards(AtGuard)
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
