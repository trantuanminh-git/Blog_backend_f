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

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private abilityFactory: AbilityFactory,
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
    // return await this.blogRepository.find({
    //   where: { id },
    //   relations: ['user', 'tags'],
    // });
    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.id = :id', { id: id })
      .leftJoinAndSelect('blog.tags', 'tags')
      .leftJoin('blog.user', 'user', 'blog.userId = user.id')
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
        created_at: 'asc',
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
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, blog);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }

    return this.blogRepository.remove(blog);
  }
}
