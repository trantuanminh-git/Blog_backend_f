import { NotificationType } from 'src/notification/entities/notification.entity';
import { ForbiddenError } from '@casl/ability';
import {
  CACHE_MANAGER,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AbilityFactory,
  Action,
} from 'src/ability/ability.factory/ability.factory';
import { Tag } from 'src/tag/entities/tag.entity';
import { TagService } from 'src/tag/tag.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ArrayContains, DataSource, Like, Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { Cache } from 'cache-manager';
import { where } from '@ucast/mongo2js';
import { Likes } from 'src/like/entities/like.entity';
import { CommentService } from 'src/comment/comment.service';
import { LikeService } from 'src/like/like.service';
import { Rating } from 'src/rating/entities/rating.entity';
import { RatingService } from 'src/rating/rating.service';
import { UpdateRatingDto } from 'src/rating/dto/update-rating.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private abilityFactory: AbilityFactory,
    private readonly ratingService: RatingService,
    private notificationService: NotificationService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async addTagToBlog(tagArray: string[], blog: Blog) {
    const existedTags = [];
    for (let k = 0; k < blog.tags.length; k++) {
      existedTags.push(blog.tags[k].tag);
    }

    for (let i = 0; i < tagArray.length; i++) {
      if (existedTags.includes(tagArray[i])) {
        console.log(tagArray[i] + ' is existed');
        continue;
      }
      const findedTag = await this.tagService.findOneByTagName(tagArray[i]);

      if (!findedTag) {
        const newTag = new Tag(tagArray[i]);
        await this.tagService.create(newTag);
        blog.tags.push(newTag);
        continue;
      }
      blog.tags.push(findedTag);
    }
  }

  async create(userId: number, createBlogDto: CreateBlogDto): Promise<Blog> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    }); // cant find user with userId=16
    if (!user) {
      const errors = { user: 'User not found.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBlog = new Blog(
      createBlogDto.title,
      createBlogDto.content,
      [],
      user,
    );
    await this.addTagToBlog(createBlogDto.tags, newBlog);
    console.log(newBlog);

    // newBlog.averageRating = this.calculateAverageRating()

    await this.blogRepository.save(newBlog);

    // return newBlog without password and refresh token
    return this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.id = :id', { id: newBlog.id })
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoin('blog.user', 'user', 'blog.userId = user.id')
      .addSelect(['user.username', 'user.email'])
      .getOne();
  }

  async findAll(): Promise<Blog[]> {
    // return await this.blogRepository.find({
    //   relations: {
    //     user: true,
    //     tags: true,
    //   },
    // });
    return await this.blogRepository
      .createQueryBuilder('blog')
      // .leftJoinAndSelect('blog.user', 'user')
      // .leftJoinAndSelect(User, 'user', 'blog.userId = user.id')
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoin('blog.user', 'user', 'blog.userId = user.id')
      .addSelect(['user.username', 'user.email'])
      // .leftJoinAndSelect('blog.user', 'user', 'blog.userId = user.id')
      // .select(['user.username', 'user.email'])
      .getMany();
  }

  async findById(id: number, ip: string): Promise<Blog> {
    // const blog1 = await this.blogRepository.findOne({
    //   where: { id },
    //   relations: ['user', 'tags', 'ratings'],
    // });
    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.id = :id', { id: id })
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoin('blog.user', 'user')
      .leftJoinAndSelect('blog.ratings', 'rating')
      .leftJoinAndSelect('blog.comments', 'comment')
      .leftJoinAndSelect('blog.likes', 'like')
      .addSelect(['user.username', 'user.email'])
      .getOne();

    if (!blog) {
      const errors = { blog: 'Blog not found.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // COUNT VIEW BASE ON IP (2s)
    const idOfIP = ip + ':id';
    const isIpExisted = await this.cacheManager.get(idOfIP);
    if (!isIpExisted) {
      await this.cacheManager.set(idOfIP, ip, 2000);
      blog.view++;
      await this.blogRepository.save(blog);
    }

    blog.comments = blog.comments.filter((comment) => comment.parentId != null);
    return blog;
  }

  async findByTag(tag: string): Promise<Blog[]> {
    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.tags', 'tagTable')
      .where(':tag IN (tagTable.tag)', { tag: tag })
      // .where('tags1.tag = :tag', { tag: tag })
      // .leftJoin('blog.user', 'user', 'blog.userId = user.id')
      // .addSelect(['user.username', 'user.email'])
      .getMany();

    if (blog.length == 0) {
      const errors = { Tag: 'Tag not found.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    const arrId = []; // list id of the blog having the tag we want to select

    for (let i = 0; i < blog.length; i++) {
      const { id } = blog[i];
      arrId.push(id);
    }

    return await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.tags', 'tag')
      .leftJoin('blog.user', 'user', 'blog.userId = user.id')
      .addSelect(['user.username', 'user.email'])
      .where('blog.id IN ( :...listId )', { listId: arrId })
      .getMany();
  }

  async findByTitle(title: string): Promise<[Blog[], number]> {
    return await this.blogRepository.findAndCount({
      order: {
        createdAt: 'asc',
      },
      where: {
        title: Like('%' + title + '%'),
      },
    });
    // const blog = await this.blogRepository
    //   .createQueryBuilder('blog')
    //   .where('blog.title = :title', { title: title })
    //   .leftJoinAndSelect('blog.tags', 'tags')
    //   .leftJoin('blog.user', 'user', 'blog.userId = user.id')
    //   .addSelect(['user.username', 'user.email'])
    //   .getMany();
  }

  async update(id: number, updateBlogDto: UpdateBlogDto, curUserId: number) {
    const currentUser = await this.userService.findOneUserDetail(curUserId);
    const ability = this.abilityFactory.defineAbility(currentUser);

    let toUpdateBlog = await this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.id = :id', { id: id })
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoin('blog.user', 'user', 'blog.userId = user.id')
      .addSelect(['user.username', 'user.email'])
      .getOne();

    // if the blog is owned by current User, add field userId to the blog to defineAbility
    if (toUpdateBlog.user.email == (await currentUser.email)) {
      toUpdateBlog = Object.assign(toUpdateBlog, { userId: curUserId });
      console.log(toUpdateBlog);
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, toUpdateBlog);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }

    const newTitle = updateBlogDto.title;
    const newContent = updateBlogDto.content;
    const newTags = updateBlogDto.tags;

    if (newTitle) toUpdateBlog.title = newTitle;
    if (newContent) toUpdateBlog.content = newContent;
    await this.addTagToBlog(newTags, toUpdateBlog); // if tag is existed, not add

    return await this.blogRepository.save(toUpdateBlog);
  }

  async remove(id: number, curUserId: number): Promise<Blog> {
    const currentUser = await this.userService.findOneUserDetail(curUserId);
    const ability = this.abilityFactory.defineAbility(currentUser);

    let blog = await this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.id = :id', { id: id })
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoin('blog.user', 'user', 'blog.userId = user.id')
      .addSelect(['user.username', 'user.email'])
      .getOne();

    if (blog.user.email == currentUser.email) {
      blog = Object.assign(blog, { userId: curUserId });
      console.log(blog);
    }

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Delete, blog);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }

    return this.blogRepository.remove(blog);
  }

  async likeBlog(id: number, userId: number): Promise<Blog> {
    try {
      const blog = await this.blogRepository.findOneBy({ id: id });
      const like = await this.likeService.findOneByBlogAndUser(userId, id);
      // check if userId has already liked post
      if (!like) {
        this.likeService.create({ userId, blogId: id });
        blog.likeCount += 1;
      } else {
        this.likeService.remove(userId, id);
        blog.likeCount -= 1;
      }
      await this.sendNotification(NotificationType.LIKE, id, userId, blog.userId);
      return await this.blogRepository.save(blog);
    } catch (err) {
      throw err;
    }
  }

  async commentToBlog(
    id: number,
    userId: number,
    content: string,
    parentId?: number,
  ): Promise<Blog> {
    try {
      const blog = await this.blogRepository.findOneBy({ id: id });
      await this.commentService.create({
        content,
        userId,
        blogId: id,
        parentId,
      });
      blog.cmtCount += 1;
      await this.blogRepository.save(blog);
      await this.sendNotification(NotificationType.COMMENT, id, userId, blog.userId);
      return await this.blogRepository.findOne({
        where: { id: id },
        relations: { comments: true },
      });
    } catch (err) {
      throw err;
    }
  }

  async updateComment(
    id: number,
    commentId: number,
    content: string,
  ): Promise<Blog> {
    try {
      await this.commentService.update(commentId, { content });
      return await this.blogRepository.findOne({
        where: { id: id },
        relations: { comments: true },
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteComment(id: number, commentId: number): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id: id });
    const subcomment = await this.commentService.findOneByParent(commentId);
    if (!subcomment) {
      this.commentService.remove(commentId);
    } else {
      this.commentService.update(commentId, {
        content: 'This comment has been deleted',
      });
    }
    blog.cmtCount -= 1;
    await this.blogRepository.save(blog);
    return await this.blogRepository.findOne({
      where: { id: id },
      relations: { comments: true },
    });
  }

  async shareBlog(id: number): Promise<Blog> {
    try {
      const blog = await this.blogRepository.findOneBy({ id: id });
      blog.shareCount += 1;
      return await this.blogRepository.save(blog);
    } catch (err) {
      throw err;
    }
  }

  async calculateAverageRating(blogId: number): Promise<number> {
    const blog = await this.blogRepository.findOne({
      where: {
        id: blogId,
      },
      relations: {
        ratings: true,
      },
    });

    if (!blog) {
      throw new Error('Blog not found');
    }

    if (blog.ratings.length == 0) {
      throw new Error('Blog have not rating');
    }

    const ratings = blog.ratings.map((rating) => rating.star);
    const sum = ratings.reduce((a, b) => a + b, 0);
    const average = sum / ratings.length;

    return average;
  }

  async findUserIdByBlogId(blogId: number): Promise<number> {
    const blog = await this.blogRepository.findOneBy({ id: blogId });

    if (!blog) {
      throw new HttpException(
        new Error("This blog doesn't exists"),
        HttpStatus.BAD_REQUEST,
      );
    }

    return blog.userId;
  }

  async ratingBlog(createRatingDto, userId, blogId): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id: blogId });

    if (!blog) {
      throw new HttpException(
        new Error("This blog doesn't exists"),
        HttpStatus.BAD_REQUEST,
      );
    }

    const rating = await this.ratingService.create(
      createRatingDto,
      userId,
      blogId,
    );

    if (!blog.averageRating) {
      blog.averageRating = rating.star;
    } else {
      const sizeRating = await this.ratingService.countRatingByBlogId(blogId);
      const avg = blog.averageRating;
      const sum = avg * (sizeRating - 1) + Number(rating.star);
      blog.averageRating = sum / sizeRating;
    }

    await this.blogRepository.save(blog);

    await this.sendNotification(NotificationType.RATING, blogId, userId, blog.userId);

    return await this.blogRepository.findOne({
      where: { id: blogId },
      relations: { ratings: true },
    });
  }

  async updateRatingBlog(
    blogId,
    idRating,
    userId: number,
    updateRatingDto: UpdateRatingDto,
  ): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id: blogId });
    if (!blog) {
      throw new HttpException(
        new Error("This blog doesn't exists"),
        HttpStatus.BAD_REQUEST,
      );
    }

    const oldRating = await this.ratingService.update(
      idRating,
      blogId,
      updateRatingDto,
      userId,
    );
    const sizeRating = await this.ratingService.countRatingByBlogId(blogId);

    const avg = blog.averageRating;

    const sum =
      avg * sizeRating - oldRating.star + Number(updateRatingDto.star);

    blog.averageRating = sum / sizeRating;
    const saveBlog = await this.blogRepository.save(blog);

    return await this.blogRepository.findOne({
      where: { id: blogId },
      relations: { ratings: true },
    });
  }

  async deleteRating(blogId, idRating, userId: number): Promise<Blog> {
    const blog = await this.blogRepository.findOneBy({ id: blogId });
    if (!blog) {
      throw new HttpException(
        new Error("This blog doesn't exists"),
        HttpStatus.BAD_REQUEST,
      );
    }

    const rating = await this.ratingService.remove(idRating, userId);

    return await this.blogRepository.findOne({
      where: { id: blogId },
      relations: { ratings: true },
    });
  }

  async filterRatingByStar(
    blogId,
    star,
    page,
    limit,
  ): Promise<[Rating[], number]> {
    return await this.ratingService.searchRatingByStar(
      blogId,
      star,
      page,
      limit,
    );
  }

  async sendNotification(notificationType: NotificationType, blogId, userIdSent, userIdReceived): Promise<void> {
    const userSent = await this.userService.findOneUser(userIdSent);

    const username = userSent.username;

    const notificationDto = {
      type: notificationType,
      username: username,
      blogId: blogId,
      userId: userIdReceived
    }

    await this.notificationService.create(userIdReceived, notificationDto);
  }
}
