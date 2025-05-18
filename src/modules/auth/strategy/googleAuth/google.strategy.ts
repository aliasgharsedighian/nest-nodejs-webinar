import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { get } from 'env-var';

const clientID = get('GOOGLE_CLIENT_ID').required().asString();
const clientSecret = get('GOOGLE_CLIENT_SECRET').required().asString();

const callbackURL =
  get('PROTOCOL').required().asString() +
  get('DOMAIN').required().asString() +
  '/auth/google/redirect';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // const { name, emails, photos } = profile;

    // const user = {
    //   email: emails?.[0]?.value,
    //   name: name?.givenName + ' ' + name?.familyName,
    //   picture: photos?.[0]?.value,
    //   provider: 'google',
    //   googleId: profile.id,
    // };

    const user = profile._json;

    done(null, user); // <--- this is CRITICAL
  }
}
