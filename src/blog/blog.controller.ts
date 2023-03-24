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
  Request,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckAbilities } from 'src/ability/abilities.decorator';
import { PoliciesGuard } from 'src/ability/abilities.guard';
import { Action } from 'src/ability/ability.factory/ability.factory';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AtGuard } from 'src/common/guards/at.guard';
import { UpdateRatingDto } from 'src/rating/dto/update-rating.dto';
import { User } from 'src/user/entities/user.entity';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { Express } from 'express';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('get-blog-by-title/:title')
  findByTitle(@Param('title') title: string): Promise<[Blog[], number]> {
    return this.blogService.findByTitle(title);
  }
  // @Get('get-blog-by-title')
  // findByTitle(@Body() title: string): Promise<Blog[]> {
  //   return this.blogService.findByTitle(title);
  // }

  @UseGuards(AtGuard) // user need to login to like blog
  @Post(':id/like')
  like(
    @GetCurrentUserId() userId: number,
    @Param('id') id: number,
  ): Promise<Blog> {
    return this.blogService.likeBlog(id, userId);
  }

  @UseGuards(AtGuard) // user need to login to comment blog
  @Post(':id/comment')
  comment(
    @GetCurrentUserId() userId: number,
    @Param('id') id: number,
    @Body('content') content: string,
    @Query('parentId') parentId?: number,
  ): Promise<Blog> {
    return this.blogService.commentToBlog(id, userId, content, parentId);
  }

  @UseGuards(AtGuard) // user need to login to update comment blog
  @Put(':id/comment/:commentId')
  updateComment(
    @GetCurrentUserId() userId: number,
    @Param('id') id: number,
    @Param('commentId') commentId: number,
    @Body('content') content: string,
  ): Promise<Blog> {
    console.log(id, commentId);
    return this.blogService.updateComment(id, commentId, content);
  }

  @UseGuards(AtGuard) // user need to login to delete comment blog
  @Delete(':id/comment/:commentId')
  deleteComment(
    @GetCurrentUserId() userId: number,
    @Param('id') id: number,
    @Param('commentId') commentId: number,
  ): Promise<Blog> {
    return this.blogService.deleteComment(id, commentId);
  }

  @UseGuards(AtGuard) // user need to login to comment blog
  @Post(':id/share')
  share(@Param('id') id: number): Promise<Blog> {
    return this.blogService.shareBlog(id);
  }

  @Get('get-blog-by-tag/:tagName')
  findByTag(@Param('tagName') tagName: string): Promise<Blog[]> {
    return this.blogService.findByTag(tagName);
  }

  @UseGuards(AtGuard)
  @Post(':id/rating')
  ratingBlog(
    @Param('id') blogId: number,
    @GetCurrentUserId() userId: number,
    @Body() createRatingDto: CreateBlogDto,
    @Request() req
  ) {
    console.log(req.user)
    return this.blogService.ratingBlog(createRatingDto, userId, blogId);
  }

  @UseGuards(AtGuard)
  @Put(':id/rating')
  updateRating(
    @Param('id') blogId: string,
    @Query('idRating') idRating: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.blogService.updateRatingBlog(
      parseInt(blogId),
      parseInt(idRating),
      userId,
      updateRatingDto,
    );
  }

  @UseGuards(AtGuard)
  @Delete(':id/rating')
  deleteRating(
    @Param('id') blogId: string,
    @Query('idRating') idRating: string,
    @GetCurrentUserId() userId: number,
  ) {
    return this.blogService.deleteRating(
      parseInt(blogId),
      parseInt(idRating),
      userId,
    );
  }

  @Get(':id/rating')
  async getRatingByStar(
    @Query('star') star: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('id') blogId: string,
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.blogService.filterRatingByStar(
      parseInt(blogId),
      parseInt(star),
      page,
      limit,
    );
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

  @Get(':id')
  findOne(@Param('id') id: string, @Ip() ip: string) {
    console.log(ip);
    return this.blogService.findById(parseInt(id), ip);
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

  @UseGuards(AtGuard) // user need to login to create blog
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @GetCurrentUserId() userId: number,
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Blog> {
    return this.blogService.create(userId, createBlogDto, file);
  }

  @Get()
  async findAll(): Promise<Blog[]> {
    return this.blogService.findAll();
  }
}
