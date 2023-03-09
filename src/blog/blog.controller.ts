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
  Query,
  Put,
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
    return this.blogService.findById(parseInt(id), ip);
  }

  @UseGuards(AtGuard) // user need to login to like blog
  @Post(':id/like')
  like(@GetCurrentUserId() userId: number, @Param() id: number): Promise<Blog> {
    console.log(userId);
    return this.blogService.likeBlog(id, userId);
  }

  @UseGuards(AtGuard) // user need to login to comment blog
  @Post(':id/comment')
  comment(
    @GetCurrentUserId() userId: number,
    @Param() id: number,
    @Body() content: string,
    @Body() parentId?: number,
  ): Promise<Blog> {
    return this.blogService.commentToBlog(id, userId, content, parentId);
  }

  @UseGuards(AtGuard) // user need to login to update comment blog
  @Put(':id/comment')
  updateComment(
    @GetCurrentUserId() userId: number,
    @Param() id: number,
    @Body() commentId: number,
    @Body() content: string,
  ): Promise<Blog> {
    return this.blogService.updateComment(id, commentId, content);
  }

  @UseGuards(AtGuard) // user need to login to delete comment blog
  @Delete(':id/comment')
  deleteComment(
    @GetCurrentUserId() userId: number,
    @Param() id: number,
    @Body() commentId: number,
  ): Promise<Blog> {
    return this.blogService.deleteComment(id, commentId);
  }

  @Get('get-blog-by-tag/:tagName')
  findByTag(@Param('tagName') tagName: string): Promise<Blog[]> {
    return this.blogService.findByTag(tagName);
  }

  /**
   * compute average rating blog
   * GET /blogs/:id/average-rating
   * @param id id blog
   * @returns average rating blog
   */
  @Get(':id/average-rating')
  async getAverageRating(@Param('id') id: string): Promise<number> {
    const averageRating = await this.blogService.calculateAverageRating(
      parseInt(id),
    );

    return averageRating;
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
