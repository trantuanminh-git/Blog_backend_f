import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

config();

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL:
        'http://ec2-18-141-140-133.ap-southeast-1.compute.amazonaws.com:3000/auth/github/redirect',
      // callbackURL: 'http://localhost:3000/auth/github/redirect',
      scope: ['email', 'profile'],
    });
  }

  // this function will be invoked when the user successfully validate themself
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { username, email, photos } = profile;
    const user = {
      email: email || username + '@gmail.com',
      firstName: username,
      //   lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      // refreshToken,
    };

    this.authService.validateUser(user);
    done(null, user);
  }
}
