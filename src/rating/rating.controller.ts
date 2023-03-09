import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { AtGuard } from 'src/common/guards/at.guard';
import { NotificationService } from 'src/notification/notification.service';
@Controller()
export class RatingController {
  constructor(
    private readonly ratingService: RatingService,
    private notificationService: NotificationService,
  ) // private blogService: BlogService,
  // private notificationGateway: NotificationGateway,
  {}

  @UseGuards(AtGuard)
  @Post('rating/blog/:id')
  async create(
    @Param('id') blogId: number,
    @GetCurrentUserId() userId: number,
    @Body() createRatingDto: CreateRatingDto) {
    
    return this.ratingService.create(createRatingDto, userId, blogId);

    // const ownBlogId = await this.blogService.findUserIdByBlogId(blogId);

    // const message = `Your post received a new rate.`

    // const notification = new Notification(NotificationType.RATING, message, new Date, ownBlogId, blogId);

    // await this.notificationService.create(notification);

    // await this.notificationGateway.sendNotificationToUser(ownBlogId, message);
  }

  // @Get('blog/:id/rating')
  // async getRatingByStar(
  //   @Query('star') star: string,
  //   @Query('page') page = 1,
  //   @Query('limit') limit = 10,
  //   @Param('id') blogId: string
  //   ) {

  //     limit = limit > 100 ? 100 : limit

  //   return this.ratingService.searchRatingByStar( parseInt(blogId), parseInt(star), page, limit);
  // }

  @Get('rating/:id')
  findOne(@Param('id') id: string) {
    return this.ratingService.findOne(+id);
  }

  @UseGuards(AtGuard)
  @Patch('rating/:id')
  update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @GetCurrentUserId() userId: number
    ) {
    return this.ratingService.update(1 ,+id, updateRatingDto, userId);
  }

  @UseGuards(AtGuard)
  @Delete('rating')
  remove(@Query('id') id: string, @GetCurrentUserId() userId: number) {
    return this.ratingService.remove(+id, userId);
  }
}
