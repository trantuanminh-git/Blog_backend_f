import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Redirect,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { AtGuard } from 'src/common/guards/at.guard';
import { RtGuard } from 'src/common/guards/rt.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/tokens.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('local/signup')
  signupLocal(@Body() dto: CreateUserDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Post('local/signin')
  signInLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  logout(@GetCurrentUserId() userId: number) {
    console.log(userId);
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshToken(userId, refreshToken);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    return 'first route';
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  // @Redirect('https://www.fetch.tech/careers', 302)
  // @Redirect('http://localhost:3000/user', 302)
  // @Redirect('http://localhost:3000', 302)
  googleAuthRedirect(@Req() req) {
    return this.authService.validateUser(req.user);
    // return this.authService.googleLogin(req);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Req() req) {
    return 'first route';
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  // @Redirect('http://localhost:3000', 302)
  facebookAuthRedirect(@Req() req) {
    return this.authService.validateUser(req.user);
    // return this.authService.googleLogin(req);
  }

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    return 'first route';
  }

  @Get('/github/redirect')
  @UseGuards(AuthGuard('github'))
  // @Redirect('http://localhost:3000', 302)
  githubAuthRedirect(@Req() req) {
    return this.authService.validateUser(req.user);
    // return this.authService.googleLogin(req);
  }
}
