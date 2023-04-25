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
import { Roles } from 'src/common/decorators/roles.decorator';
import { AtGuard } from 'src/common/guards/at.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
// import { UserIsAuthorGuard } from 'src/common/guards/user-is-author.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Roles('admin')
  @UseGuards(AtGuard, RoleGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get('chart')
  getChart() {
    return this.commentService.getChart();
  }

  @Get('latest')
  indexAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    limit = limit > 100 ? 100 : limit;

    return this.commentService.paginateAll({
      limit: Number(limit),
      page: Number(page),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commentService.findOne(id);
  }

  @Roles('admin')
  @UseGuards(AtGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Roles('admin')
  @UseGuards(AtGuard, RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.commentService.remove(id);
  }
}
