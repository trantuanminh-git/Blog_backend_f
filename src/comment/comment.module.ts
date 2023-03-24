import { forwardRef, Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), forwardRef(() => BlogModule)],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
