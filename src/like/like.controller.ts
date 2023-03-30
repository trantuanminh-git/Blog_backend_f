import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { AtGuard } from 'src/common/guards/at.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/roles.guard';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Roles('admin')
  @UseGuards(AtGuard, RoleGuard)
  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  @Get()
  async findAll(@Query('blog') userId: number, blogId: number) {
    if (!blogId && !userId) return await this.likeService.findAll();
    return await this.likeService.findOneByBlogAndUser(userId, blogId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.likeService.findOne(id);
  }

  @Roles('admin')
  @UseGuards(AtGuard, RoleGuard)
  @Delete()
  remove(@Query('blog') userId: number, blogId: number) {
    return this.likeService.remove(+userId, +blogId);
  }
}
