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
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AtGuard } from 'src/common/guards/at.guard';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/roles.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Roles('admin')
  @UseGuards(AtGuard, RoleGuard)
  @Get('/showAll')
  async getRatingByStar(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.notificationService.findAll(
      page,
      limit
    );
  }

  @Roles('admin')
  @UseGuards(AtGuard, RoleGuard)
  @Get('/all')
  async getAll() {

    return this.notificationService.all();
  }

  @Post()
  @UseGuards(AtGuard)
  create(@Body()notification: CreateNotificationDto) {
    return this.notificationService.create(notification); //use admin guard
  }

  @Get()
  @UseGuards(AtGuard)
  getAllNotification(@GetCurrentUserId() userId: number) {
    return this.notificationService.findNotificationsByUserId(userId);
  }

  @Get(':id')
  @UseGuards(AtGuard)
  getOne(@Param('id') id: string) {
    return this.notificationService.getOne(+id);
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
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @UseGuards(AtGuard)
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
