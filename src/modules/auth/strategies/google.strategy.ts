import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as process from 'node:process';
import any = jasmine.any;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;
    const { givenName: firstName, familyName: lastName } = name;
    const [emailData] = emails;
    const [image] = photos;
    const user = {
      email: emailData.value,
      firstName,
      lastName,
      picture: image.value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
