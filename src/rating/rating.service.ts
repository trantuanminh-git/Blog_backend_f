import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
  ) {}

  async create(createRatingDto: CreateRatingDto, userId: number, blogId: number): Promise<Rating> {
    const checkRating = await this.ratingRepository.findOneBy(
      {
        userId: userId,
        blogId: blogId
      })

    if (checkRating) {
      throw new HttpException("User just one rating.", HttpStatus.BAD_REQUEST);
    }

    const rating = new Rating(createRatingDto.star, new Date(), userId, blogId);
    const saveRating = this.ratingRepository.save(rating);
    return saveRating;
  }

  findOne(id: number) {
    return this.ratingRepository
                .createQueryBuilder('rating')
                .where("rating.id = :id", { id: id })
                .leftJoinAndSelect("rating.blog", "blog")
                .leftJoin("rating.user", "user")
                .addSelect(["user.userName", "user.email", "blog.title"])
                .getOne()
  }

  async update(id: number, updateRatingDto: UpdateRatingDto, userId: number): Promise<Rating> {
    const rating = await this.ratingRepository.findOneBy({id: id, userId: userId})

    if (!rating) {
      throw new HttpException("This rating doesn't exists.", HttpStatus.BAD_REQUEST);
    }

    rating.star = updateRatingDto.star;
    rating.updatedAt = new Date()

    return await this.ratingRepository.save(rating);
  }

  async remove(id: number, userId: number): Promise<Rating> {
    const rating = await this.ratingRepository.findOneBy({id: id, userId: userId});

    if (!rating) {
      throw new HttpException("This rating doesn't exists.", HttpStatus.BAD_REQUEST);
    }

    await this.ratingRepository.delete({id: id});

    return rating;
  }

  async searchRatingByStar(id: number, star: number, page: number, limit: number): Promise<[Rating[], number]> {
    limit = 10
    const skipRating = limit*(page-1)

    return await this.ratingRepository.findAndCount({
        take: limit,
        skip: skipRating,
        order: {
            createdAt: 'DESC'
        },
        where: {
          blogId: id,
          star: star
        }
    });
  }

}
