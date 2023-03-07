import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

  // @Get()
  // findAll() {
  //   return this.likeService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.likeService.findOne(id);
  }

  @Delete(':id')
  remove(@Body() userId: number, blogId: number) {
    return this.likeService.remove(userId, blogId);
  }
}
