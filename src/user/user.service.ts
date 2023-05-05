import { AwsService } from './../aws/aws.service';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReadUserInfoDto } from './dto/read-user-info.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { response } from 'express';
import {
  AbilityFactory,
  Action,
} from 'src/ability/ability.factory/ability.factory';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectMapper() private classMapper: Mapper,
    private abilityFactory: AbilityFactory,
    private awsService: AwsService,
  ) {}
  async create(
    createUserDto: CreateUserDto,
    currentUserId: number,
  ): Promise<ReadUserInfoDto> {
    const currentUser = await this.findOneUserDetail(currentUserId);
    const ability = this.abilityFactory.defineAbility(currentUser);

    // hash password
    const hash = await this.hashData(createUserDto.password);

    // check unique email
    const { email } = createUserDto;
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      const errors = { email: 'Email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }
    // check existed role
    const role = await this.roleRepository.findOne({
      where: { role: createUserDto.role + '' },
    });
    if (!role) {
      const errors = { role: 'Role not found.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    const newUser = new User(
      createUserDto.email,
      createUserDto.password,
      createUserDto.username,
      createUserDto.biography,
      role,
    );

    newUser.password = hash;
    console.log(newUser);

    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Create, newUser);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }

    return this.classMapper.mapAsync(
      await this.userRepository.save(newUser),
      User,
      ReadUserInfoDto,
    );
  }

  async findAll(): Promise<ReadUserInfoDto[]> {
    const allUser = await this.userRepository.find({
      relations: ['role', 'blogs'],
    }); // SELECT * FROM users
    return this.classMapper.mapArrayAsync(allUser, User, ReadUserInfoDto);
  }

  async getChart(): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select('DATE(user.createdAt) AS date, COUNT(*) AS count')
      .groupBy('date')
      .getRawMany();

    return users;
  }

  async getCount() {
    const data = await this.findAll();
    const count = data.length;

    return count;
  }

  async findOne(id: number): Promise<ReadUserInfoDto[]> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .leftJoinAndSelect('user.blogs', 'blogs')
      .leftJoinAndSelect('blogs.tags', 'tags')
      .leftJoinAndSelect('user.role', 'role')
      .getMany();
    return this.classMapper.mapArrayAsync(user, User, ReadUserInfoDto);
    // return this.usersRepository.findOneBy({id})
  }

  async findOneUserDetail(id: number): Promise<User> {
    const currentUser = await this.userRepository.findOne({
      where: { id: id },
      relations: ['role', 'blogs'],
    });
    return currentUser;
  }

  async findOneUserBySocial(socialId, social): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.socialId = :socialId', { socialId: socialId })
      .andWhere('user.social = :social', { social: social })
      .getOne();
    if (!user) return null;
    return this.findOneUserDetail(user.id)[0];
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUserId: number,
  ): Promise<UpdateUserDto> {
    // const user = await this.findOne(id);
    // return this.usersRepository.save({ ...user, ...updateUserDto }); // create one more new user having the updated info
    // ===============================================================================================
    const currentUser = await this.findOneUserDetail(currentUserId);
    const ability = this.abilityFactory.defineAbility(currentUser);

    const toUpdate = await this.findOneUserDetail(id);
    if (!toUpdate) {
      const err = 'not found user';
      throw new HttpException(
        { message: 'Input data validation failed', err },
        HttpStatus.BAD_REQUEST,
      );
    }

    const role = await this.roleRepository.findOne({
      where: { role: updateUserDto.role + '' },
    });
    if (!role) {
      const errors = { role: 'Role not found.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create new user
    const userToUpdate = new User(
      updateUserDto.email,
      updateUserDto.password,
      updateUserDto.username,
      updateUserDto.biography,
      role,
    );

    // const userToUpdate = new User(
    //   'email2@gmail.com',
    //   'abc',
    //   'minhtran2',
    //   'mybio2',
    //   new Role('blogger'),
    // );
    // userToUpdate.id = 400;
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Update, toUpdate);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
    await this.userRepository.update(id, userToUpdate);

    // update call DB
    return this.classMapper.mapAsync(
      await this.findOneUserDetail(id),
      User,
      ReadUserInfoDto,
    );
  }

  async remove(id: number, currentUserId: number): Promise<User> {
    const currentUser = await this.findOneUserDetail(currentUserId);
    const ability = this.abilityFactory.defineAbility(currentUser);
    // =============================================================================================
    const userToDelete = await this.userRepository.findOne({ where: { id } });
    try {
      ForbiddenError.from(ability).throwUnlessCan(Action.Delete, userToDelete);
    } catch (err) {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
    return this.userRepository.remove(userToDelete);
  }

  async hashData(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  async findOneUser(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['role'],
    });
  }

  async findOneUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email: email });
  }

  async uploadAvatar(userId: number, file): Promise<ReadUserInfoDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const avatar = await this.awsService.fileUpload(file);
    user.avatarUrl = avatar + '';
    const saveUser = await this.userRepository.save(user);
    return this.classMapper.map(saveUser, User, ReadUserInfoDto);
  }

  async findAdmins(): Promise<ReadUserInfoDto[]> {
    const user = await this.userRepository.find({ where: { roleId: 1 } });

    return this.classMapper.mapArrayAsync(user, User, ReadUserInfoDto);
  }
}
