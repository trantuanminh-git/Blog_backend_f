import { NotificationType } from 'src/notification/entities/notification.entity';
import { ForbiddenError } from '@casl/ability';
import {
  CACHE_MANAGER,
  ForbiddenException,
  forwardRef,
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
import { ReadBlogDto } from './dto/read-blog.dto';
import { AwsService } from 'src/aws/aws.service';

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
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    private readonly awsService: AwsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async addTagToBlog(tagList: string[]): Promise<Tag[] | undefined> {
    const tags = [];
    for (let i = 0; i < tagList.length; i++) {
      const tag = await this.tagService.create({ tag: tagList[i] });
      tags.push(tag);
    }
    return tags;
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
      createBlogDto.imageUrl,
      [],
      user,
    );

    const newTags = createBlogDto.tags.split(' ');
    newBlog.tags = await this.addTagToBlog(newTags);
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
    const blogs = await this.blogRepository
      .createQueryBuilder('blog')
      // .leftJoinAndSelect('blog.user', 'user')
      // .leftJoinAndSelect(User, 'user', 'blog.userId = user.id')
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoin('blog.user', 'user', 'blog.userId = user.id')
      .addSelect(['user.username', 'user.email'])
      .leftJoinAndSelect('blog.likes', 'likes')
      .leftJoin('likes.user', 'userLike')
      .addSelect(['userLike.username'])
      .loadRelationCountAndMap('blog.likeCount', 'blog.likes')
      .loadRelationCountAndMap('blog.cmtCount', 'blog.comments')
      // .leftJoinAndSelect('blog.user', 'user', 'blog.userId = user.id')
      // .select(['user.username', 'user.email'])
      .getMany();

    return blogs;
  }

  async findById(id: number, ip?: string): Promise<Blog> {
    // const blog1 = await this.blogRepository.findOne({
    //   where: { id },
    //   relations: ['user', 'tags', 'ratings'],
    // });
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['likes', 'comments'],
    });

    if (!blog) {
      const errors = { blog: 'Blog not found.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    blog.likeCount = blog.likes.length;
    blog.cmtCount = blog.comments.length;

    // COUNT VIEW BASE ON IP (2s)
    if (ip) {
      const idOfIP = ip + ':id';
      const isIpExisted = await this.cacheManager.get(idOfIP);
      if (!isIpExisted) {
        await this.cacheManager.set(idOfIP, ip, 2000);
        blog.view++;
      }
    }

    await this.blogRepository.save(blog);

    const blogDetail = await this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.id = :id', { id: id })
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoin('blog.user', 'userBlog')
      .addSelect(['userBlog.username', 'userBlog.email'])
      .leftJoinAndSelect('blog.ratings', 'rating')
      .leftJoinAndSelect('blog.comments', 'comments')
      .loadRelationCountAndMap('blog.cmtCount', 'blog.comments')
      .leftJoin('comments.user', 'userCmt')
      .addSelect(['userCmt.username'])
      .leftJoinAndSelect('blog.likes', 'likes')
      .loadRelationCountAndMap('blog.likeCount', 'blog.likes')
      .leftJoin('likes.user', 'userLike')
      .addSelect('userLike.username')
      .getOne();

    return blogDetail;
  }

  async findByTag(tag: string): Promise<[Blog[], number]> {
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
      .getManyAndCount();
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
    const newTags = updateBlogDto.tags.split(' ');
    const imageUrl = updateBlogDto.imageUrl;

    if (newTitle) toUpdateBlog.title = newTitle;
    if (newContent) toUpdateBlog.content = newContent;
    if (imageUrl) toUpdateBlog.imageUrl = imageUrl;
    toUpdateBlog.tags = await this.addTagToBlog(newTags); // if tag is existed, not add

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
        const newLike = await this.likeService.create({ userId, blogId: id });
        // console.log(like);
        await this.sendNotification(NotificationType.LIKE, id, userId);
      } else {
        const newLike = await this.likeService.remove(userId, id);
        // console.log(like);
      }
      return await this.findById(id);
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
      await this.sendNotification(NotificationType.COMMENT, id, userId);
      return await this.findById(id);
    } catch (err) {
      throw err;
    }
  }

  async updateComment(
    id: number,
    userId: number,
    commentId: number,
    content: string,
  ): Promise<Blog> {
    const comment = await this.commentService.findOne(commentId);
    const currentUser = await this.userService.findOneUserDetail(userId);
    // console.log(userId);
    const ability = this.abilityFactory.defineAbility(currentUser);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, comment);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }

    try {
      await this.commentService.update(commentId, { content });
      return await this.findById(id);
    } catch (err) {
      throw err;
    }
  }

  async deleteComment(
    id: number,
    userId: number,
    commentId: number,
  ): Promise<Blog> {
    const comment = await this.commentService.findOne(commentId);
    const currentUser = await this.userService.findOneUserDetail(userId);
    console.log(userId);
    const ability = this.abilityFactory.defineAbility(currentUser);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Delete, comment);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
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
    return this.findById(id);
  }

  async shareBlog(id: number): Promise<Blog> {
    try {
      const blog = await this.blogRepository.findOneBy({ id: id });
      blog.shareCount += 1;
      await this.blogRepository.save(blog);
      return this.findById(id);
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

    await this.sendNotification(NotificationType.LIKE, blogId, userId);

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
    const rating = await this.commentService.findOne(idRating);
    const currentUser = await this.userService.findOneUserDetail(userId);
    // console.log(userId);
    const ability = this.abilityFactory.defineAbility(currentUser);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, rating);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
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
    const foundRating = await this.commentService.findOne(idRating);
    const currentUser = await this.userService.findOneUserDetail(userId);
    // console.log(userId);
    const ability = this.abilityFactory.defineAbility(currentUser);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Delete, foundRating);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
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

  async sendNotification(
    notificationType: NotificationType,
    blogId,
    userIdSent,
  ): Promise<void> {
    const userSent = await this.userService.findOneUser(userIdSent);

    const username = userSent.username;

    const notificationDto = {
      type: notificationType,
      username: username,
      blogId: blogId,
      userId: userIdSent,
    };

    await this.notificationService.create(notificationDto);
  }

  // async uploadImage(userId: number, file, blogId: number): Promise<Blog> {
  //   if (!file) {
  //     throw new HttpException(
  //       new Error("This file doesn't exists"),
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const blog = await this.blogRepository.findOneBy({
  //     id: blogId,
  //     userId: userId,
  //   });
  //   if (!blog) {
  //     throw new HttpException(
  //       new Error("This blog doesn't exists"),
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const urlImage = await this.awsService.fileUpload(file);
  //   blog.imageUrl = urlImage+'';

  //   return await this.blogRepository.save(blog);
  // }

  async findBlogByUserId(userId: number): Promise<Blog[]> {
    return await this.blogRepository.find({
      where: {
        userId: userId,
      },
    });
  }
}
