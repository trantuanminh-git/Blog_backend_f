import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
  ) {}

  async create(
    createLikeDto: CreateLikeDto,
    userId: number,
    blogId: number,
  ): Promise<Like> {
    const like = new Like();
    like.userId = userId;
    like.blogId = blogId;
    const saveLike = this.likeRepository.save(like);
    return saveLike;
  }

  async findOne(id: number) {
    return this.likeRepository
      .createQueryBuilder('like')
      .where('like.id = :id', { id: id })
      .leftJoinAndSelect('like.blog', 'blog')
      .leftJoin('like.user', 'user')
      .addSelect(['user.userName', 'blog.title'])
      .getOne();
  }

  async remove(id: number, userId: number): Promise<Like> {
    const like = await this.likeRepository.findOneBy({
      id: id,
      userId: userId,
    });

    if (!like) {
      throw new HttpException(
        "This rating doesn't exists.",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.likeRepository.delete({ id: id });

    return like;
  }
}
