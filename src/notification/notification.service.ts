import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}
  async create(notification: Notification): Promise<void> {
    await this.notificationRepository.save(notification);
  }

  async findNotificationsByUserId(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: {
        userId: userId
      },
      order: {
        createdAt: 'DESC'
      }
    })
  }

  findAll() {
    return `This action returns all notification`;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<any> {
    const notification = await this.notificationRepository.update(
      { id},
      { content: updateNotificationDto.content})
    
    return notification;
  }

  async remove(id: number) {
    return await this.notificationRepository.delete(id);
  }

  async markNotificationsAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }
}
