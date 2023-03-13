import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.userId = createCommentDto.userId;
    comment.blogId = createCommentDto.blogId;
    comment.parentId = createCommentDto.parentId;
    const saveComment = this.commentRepository.save(comment);
    return saveComment;
  }

  async findAll() {
    return await this.commentRepository.find();
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
    const rating = await this.commentRepository.findOneBy({
      id: id,
    });

    if (!rating) {
      throw new HttpException(
        "This comment doesn't exists.",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.commentRepository.delete({ id: id });

    return rating;
  }
}
