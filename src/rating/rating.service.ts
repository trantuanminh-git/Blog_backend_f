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
    const rating = new Rating(createRatingDto.star, new Date(), userId, blogId);
    const saveRating = this.ratingRepository.save(rating);
    return saveRating;
  }

  async findAllInBlog(blogId: number) {
    return await this.ratingRepository
                        .createQueryBuilder('rating')
                        // .where("rating.blogId = :id", { id: id })
                        // .leftJoinAndSelect("rating.tags", "tag")
                        // .leftJoin("blog.user", "user")
                        // .addSelect(["user.userName", "user.email"])
                        // .getOne()
              ;
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
}
