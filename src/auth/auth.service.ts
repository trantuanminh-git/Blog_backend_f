import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/tokens.type';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { SocialLoginDto } from './dto/socialLogin.dto';
import jwt_decode from 'jwt-decode';
import { GoogleLoginDto } from './dto/googleLogin.dto';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/entities/notification.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly notificationService: NotificationService,
  ) {}
  async signupLocal(dto: CreateUserDto): Promise<Tokens> {
    const hash = await this.hashData(dto.password);
    // check unique email
    const { email } = dto;
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (user) {
      const errors = { email: 'Email must be unique.' };
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    }

    // check exist role
    // let role = await this.roleService.findOneByRole(user?.role.role || '');
    // if (!role) role = await this.roleService.findOneByRole('user'); // DEFAULT ROLE is user

    // DEFAULT ROLE is blogger
    const role = await this.roleService.findOneByRole('blogger');

    // create new user
    const newUser = await this.userRepository.create(dto);
    newUser.role = role;
    newUser.password = hash;
    const savedUser = await this.userRepository.save(newUser);

    const notificationDto = {
      type: NotificationType.REGISTER,
      username: savedUser.username,
      blogId: null,
      userId: savedUser.id,
    };

    await this.notificationService.create(notificationDto);

    const tokens = await this.getTokens(newUser.id, newUser.email); // tokens contain access token and refresh token
    this.addRefreshTokenToDB(newUser.id, tokens.refresh_token);

    console.log(tokens);
    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      console.log('not found user');
      throw new ForbiddenException('User not found! Access Denied');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new ForbiddenException('Wrong password! Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    this.addRefreshTokenToDB(user.id, tokens.refresh_token); // add refresh token to the database
    // when sign in, refresh token will change
    console.log('sign in successful');
    return tokens;
  }

  async logout(userId: number) {
    const user = await this.userRepository.find({
      where: { id: userId, refreshToken: Not(IsNull()) },
    });
    // Object.assign(user[0], { refreshToken: null });
    for (let i = 0; i < user.length; i++) {
      Object.assign(user[i], { refreshToken: null });
    }
    await this.userRepository.save(user);
    console.log('logout successful');
  }

  async refreshToken(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.userRepository.findOne({
      where: [{ id: userId }, { refreshToken: Not(IsNull()) }],
    });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Not found user RtTokens >> Access denied');
    const isRefreshTokenMatches = await bcrypt.compare(
      refreshToken, // refresh token of the current user
      user.refreshToken, // refresh token in the DB
    );

    if (!isRefreshTokenMatches)
      throw new ForbiddenException('refreshToken not matches >> Access denied');
    const tokens = await this.getTokens(user.id, user.email);

    this.addRefreshTokenToDB(user.id, tokens.refresh_token); // fill refreshToken field in the database
    // console.log(user);
    return tokens;
  }

  async addRefreshTokenToDB(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    const toUpdate = await this.userRepository.findOne({
      where: { id: userId },
    });

    const updated = Object.assign(toUpdate, { refreshToken: hash });
    return await this.userRepository.save(updated);
  }

  async getTokens(userId: number, email: string) {
    const user = await this.userService.findOneUser(userId);
    const roleName = user.role.role;
    const [at, rt] = await Promise.all([
      // sign the user's id and email to get accessToken and refreshToken
      this.jwtService.signAsync(
        {
          user_ID: userId,
          email,
          role: roleName,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 60 * 24, // accessTokens will expire in 1 day // 15 minutes //
        },
      ),
      this.jwtService.signAsync(
        {
          user_ID: userId,
          email,
          role: roleName,
        },
        {
          secret: 'rt-secret',
          expiresIn: 7 * 24 * 60 * 60, // refreshTokens will expire in a week
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async hashData(password: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    const result = {
      message: 'User information from google',
      user: req.user,
    };

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  // return tokens, contain access token and refresh token
  async validateUser(loginUser) {
    console.log('AuthService');
    const user = await this.userRepository.findOne({
      where: { email: loginUser.email },
    });

    if (user) {
      console.log('user already exists in DB');
      // console.log(loginUser);
      const tokens = await this.getTokens(user.id, user.email); // tokens contain access token and refresh token
      this.addRefreshTokenToDB(user.id, tokens.refresh_token);
      // create new access token and refresh token
      console.log(tokens);
      return tokens;
    } else {
      console.log('create new user in DB - by GG / FB / Twitter');
      // check exist role
      let role = await this.roleService.findOneByRole(user?.role.role || '');
      if (!role) {
        role = await this.roleService.findOneByRole('user');
      }
      const newUser = new User(
        loginUser.email,
        Math.random().toString(36).substring(3, 12),
        loginUser.firstName,
        'Default Bio',
        role,
      );
      this.signupLocal(newUser);
      // create new user , generate random password
    }
  }

  async socialLogin(socialLoginData: SocialLoginDto): Promise<Tokens> {
    // infomation of user login social
    // const data = (await this.jwtService.decode(tokenSocial)) as GoogleLoginDto;

    // check if user login with social is already existed in database, check by socialId and social
    const userLoginInfo = await this.userService.findOneUserBySocial(
      socialLoginData.socialId,
      socialLoginData.social,
    );
    console.log(userLoginInfo);

    if (!userLoginInfo) {
      // if user not already login with social, but user already use the email to sign up local before
      const userCheckEmail = await this.userRepository.findOne({
        where: { email: socialLoginData.email },
      });
      if (userCheckEmail) {
        const tokens = await this.getTokens(
          userCheckEmail.id,
          userCheckEmail.email,
        ); // tokens contain access token and refresh token
        this.addRefreshTokenToDB(userCheckEmail.id, tokens.refresh_token);
        // create new access token and refresh token
        console.log(tokens);
        return tokens;
      }
      // ----------------------------------------------------------------------------------------------
      console.log('create new user in DB - by GG / FB / Twitter');
      // check exist role
      let role = await this.roleService.findOneByRole(
        userLoginInfo?.role.role || '',
      );
      if (!role) {
        role = await this.roleService.findOneByRole('user');
      }
      const newUser = new User(
        socialLoginData.email,
        Math.random().toString(36).substring(3, 12),
        socialLoginData.name,
        'Default Bio',
        role,
      );
      newUser.socialId = socialLoginData.socialId;
      newUser.social = socialLoginData.social;
      return this.signupLocal(newUser);
    }

    console.log('user already exists in DB');
    // console.log(loginUser);
    const tokens = await this.getTokens(userLoginInfo.id, userLoginInfo.email); // tokens contain access token and refresh token
    this.addRefreshTokenToDB(userLoginInfo.id, tokens.refresh_token);
    // create new access token and refresh token
    console.log(tokens);
    return tokens;
  }
}
