import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { Likes } from './entities/like.entity';
import { Repository } from 'typeorm';
import { Blog } from 'src/blog/entities/blog.entity';
import { zipWith } from 'rxjs';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Likes) private likeRepository: Repository<Likes>,
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async create(createLikeDto: CreateLikeDto): Promise<Likes> {
    const like = new Likes();
    like.userId = createLikeDto.userId;
    like.blogId = createLikeDto.blogId;
    const blog = await this.blogRepository.findOne({
      where: {
        id: createLikeDto.blogId,
      },
      relations: {
        likes: true,
      },
    });
    blog.likes.push(like);
    blog.likeCount += 1;
    console.log(blog);
    await this.blogRepository.save(blog);
    return like;
  }

  async findAll() {
    return await this.likeRepository.find();
  }

  async findOneByBlogAndUser(userId: number, blogId: number) {
    if (userId == undefined || blogId == undefined) return null;
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

    const blog = await this.blogRepository.findOneBy({
      id: blogId,
    });
    blog.likeCount -= 1;
    this.blogRepository.save(blog);

    await this.likeRepository.delete({
      id: like.id,
    });

    return like;
  }
}
