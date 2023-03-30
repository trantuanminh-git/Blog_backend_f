import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { In, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { BlogService } from 'src/blog/blog.service';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    // @Inject(forwardRef(() => BlogService))
    private readonly blogService: BlogService,
  ) {}

  async create(
    ownBlog: number,
    notiDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = new Notification(
      notiDto.type,
      notiDto.username,
      notiDto.userId,
      notiDto.blogId,
    );

    const savedNotification = await this.notificationRepository.save(
      notification,
    );
    // this.notificationsGateway.sendNotificationToUser( ownBlog, savedNotification.content);
    return savedNotification;
  }

  async findNotificationsByUserId(userId: number): Promise<Notification[]> {
    const blogs = await this.blogService.findBlogByUserId(userId);
    const blogIds = [];
    blogs.forEach((val) => blogIds.push(val.id));

    return await this.notificationRepository.find({
      where: {
        userId: In(blogIds),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getOne(id: number, userId: number) {
    const notification = await this.notificationRepository.findOneBy({
      id: id,
      userId: userId,
    });

    if (!notification) {
      throw new HttpException(
        new Error("This notification doesn't exists"),
        HttpStatus.BAD_REQUEST,
      );
    }
    notification.isRead = true;
    await this.notificationRepository.save(notification);
    return `/blog/${notification.blogId}`;
  }

  findAll() {
    return `This action returns all notification`;
  }

  async update(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
    userId: number,
  ): Promise<any> {
    const noti = await this.notificationRepository.findOneBy({
      id: id,
      userId: userId,
    });

    if (!noti) {
      throw new HttpException(
        new Error("This notification doesn't exists"),
        HttpStatus.BAD_REQUEST,
      );
    }

    const notification = await this.notificationRepository.update(
      { id },
      { content: updateNotificationDto.type },
    );

    return notification;
  }

  async remove(id: number, userId: number) {
    const noti = await this.notificationRepository.findOneBy({
      id: id,
      userId: userId,
    });

    if (!noti) {
      throw new HttpException(
        new Error("This notification doesn't exists"),
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.notificationRepository.delete(id);
  }

  async markNotificationsAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async findCurrentNoti(userId: number, blogId: number): Promise<Notification> {
    return await this.notificationRepository.findOneBy({
      userId: userId,
      blogId: blogId,
    });
  }
}
