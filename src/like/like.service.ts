import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { Likes } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Likes) private likeRepository: Repository<Likes>,
  ) {}

  async create(
    createLikeDto: CreateLikeDto,
    userId: number,
    blogId: number,
  ): Promise<Likes> {
    const like = new Likes();
    like.userId = userId;
    like.blogId = blogId;
    const saveLike = this.likeRepository.save(like);
    return saveLike;
  }

  async findAll() {
    return await this.likeRepository.find();
  }

  async findOneByBlogAndUser(userId: number, blogId: number) {
    return await this.likeRepository.findOneBy({
      userId: userId,
      blogId: blogId,
    });
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

  async remove(userId: number, blogId: number): Promise<Likes> {
    const like = await this.findOneByBlogAndUser(userId, blogId);
    if (!like) {
      throw new HttpException(
        "This like doesn't exists.",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.likeRepository.delete({
      id: like.id,
    });

    return like;
  }
}
