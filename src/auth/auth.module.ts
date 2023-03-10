import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'secret-key',
      signOptions: { expiresIn: '60s' },
    }),
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    GithubStrategy,
  ], // need to import AtStrategy to use guard
})
export class AuthModule {}
