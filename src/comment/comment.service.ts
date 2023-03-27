import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { Blog } from 'src/blog/entities/blog.entity';
import {
  Pagination,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
import { from, Observable, map } from 'rxjs';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.userId = createCommentDto.userId;
    comment.blogId = createCommentDto.blogId;
    comment.parentId = createCommentDto.parentId;
    const blog = await this.blogRepository.findOne({
      where: {
        id: createCommentDto.blogId,
      },
      relations: {
        comments: true,
      },
    });
    blog.comments.push(comment);
    blog.cmtCount += 1;
    console.log(blog);
    await this.blogRepository.save(blog);
    return comment;
  }

  async findAll() {
    return await this.commentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  paginateAll(options: IPaginationOptions): Observable<Pagination<Comment>> {
    return from(
      paginate<Comment>(this.commentRepository, options, {
        order: { createdAt: 'DESC' },
      }),
    ).pipe(map((commentEntries: Pagination<Comment>) => commentEntries));
  }

  async findOne(id: number) {
    return this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id: id })
      .leftJoin('comment.blog', 'blog')
      .leftJoin('comment.user', 'user')
      .leftJoinAndSelect('comment.childComments', 'childComment')
      .addSelect(['user.userName', 'blog.title'])
      .getOne();
  }

  async findOneByParent(parentId: number) {
    return await this.commentRepository.findOneBy({ parentId: parentId });
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOneBy({
      id: id,
    });

    if (!comment) {
      throw new HttpException(
        "This comment doesn't exists.",
        HttpStatus.BAD_REQUEST,
      );
    }

    comment.content = updateCommentDto.content;

    return await this.commentRepository.save(comment);
  }

  async remove(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOneBy({
      id: id,
    });

    if (!comment) {
      throw new HttpException(
        "This comment doesn't exists.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const blog = await this.blogRepository.findOneBy({
      id: comment.blogId,
    });
    blog.cmtCount -= 1;
    this.blogRepository.save(blog);

    await this.commentRepository.delete(id);

    return comment;
  }
}
