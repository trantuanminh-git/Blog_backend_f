import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
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
}
