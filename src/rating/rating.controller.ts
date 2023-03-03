import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  create(
    @Param('id') idBlog: number,
    @GetCurrentUserId() userId: number,
    @Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.create(createRatingDto, userId, idBlog);
  }

  @Get()
  findAll() {
    // return this.ratingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateRatingDto: UpdateRatingDto,
    @GetCurrentUserId() userId: number
    ) {
    return this.ratingService.update(+id, updateRatingDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetCurrentUserId() userId: number
    ) {
    return this.ratingService.remove(+id, userId);
  }
}
