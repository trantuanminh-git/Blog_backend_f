import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './entities/rating.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { BlogModule } from 'src/blog/blog.module';
import { NotificationGateway } from 'src/notification/notificationGateway';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]), NotificationModule],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
