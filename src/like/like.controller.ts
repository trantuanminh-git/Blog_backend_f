import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto, userId: number, blogId: number) {
    return this.likeService.create(createLikeDto, userId, blogId);
  }

  @Get()
  findAll(@Query('blog') userId: number, blogId: number) {
    if (!blogId && !userId) return this.likeService.findAll();
    return this.likeService.findOneByBlogAndUser(userId, blogId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.likeService.findOne(id);
  }

  @Delete()
  remove(@Query('blog') userId: number, blogId: number) {
    return this.likeService.remove(userId, blogId);
  }
}
