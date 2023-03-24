import { forwardRef, Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Likes } from './entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [TypeOrmModule.forFeature([Likes]), forwardRef(() => BlogModule)],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
