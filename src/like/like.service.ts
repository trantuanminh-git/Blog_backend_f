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

  async create(createLikeDto: CreateLikeDto): Promise<Likes> {
    const like = new Likes();
    like.userId = createLikeDto.userId;
    like.blogId = createLikeDto.blogId;
    console.log(like);
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
    return await this.likeRepository
      .createQueryBuilder('like')
      .where('like.id = :id', { id: id })
      .leftJoinAndSelect('like.blog', 'blog')
      .leftJoin('like.user', 'user')
      .addSelect(['user.userName', 'blog.title'])
      .getOne();
  }

  async remove(userId: number, blogId: number): Promise<Likes> {
    const like = await await this.likeRepository.findOneBy({
      userId: userId,
      blogId: blogId,
    });
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
