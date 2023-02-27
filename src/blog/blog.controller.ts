import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { CheckAbilities } from 'src/ability/abilities.decorator';
import { PoliciesGuard } from 'src/ability/abilities.guard';
import { Action } from 'src/ability/ability.factory/ability.factory';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AtGuard } from 'src/common/guards/at.guard';
import { User } from 'src/user/entities/user.entity';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(AtGuard) // user need to login to create blog
  @Post()
  create(
    @GetCurrentUserId() userId: number,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<Blog> {
    console.log(userId);
    return this.blogService.create(userId, createBlogDto);
  }

  @Get()
  async findAll(): Promise<Blog[]> {
    return this.blogService.findAll();
  }
  @Get('get-blog-by-title/:title')
  findByTitle(@Param('title') title: string): Promise<[Blog[], number]> {
    return this.blogService.findByTitle(title);
  }
  // @Get('get-blog-by-title')
  // findByTitle(@Body() title: string): Promise<Blog[]> {
  //   return this.blogService.findByTitle(title);
  // }
  @Get(':id')
  findOne(@Param('id') id: string, @Ip() ip: string) {
    console.log(ip);
    return this.blogService.findById(+id, ip);
  }

  @Get('get-blog-by-tag/:tagName')
  findByTag(@Param('tagName') tagName: string): Promise<Blog[]> {
    return this.blogService.findByTag(tagName);
  }

  @UseGuards(AtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @GetCurrentUserId() curUserId: number,
  ) {
    return this.blogService.update(+id, updateBlogDto, curUserId);
  }

  @UseGuards(AtGuard)
  @Delete(':id')
  // @UseGuards(PoliciesGuard)
  // @CheckAbilities({ action: Action.Manage, subject: Blog })
  remove(
    @Param('id') id: string,
    @GetCurrentUserId() curUserId: number,
  ): Promise<Blog> {
    return this.blogService.remove(+id, curUserId);
  }
}
