import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { get } from 'env-var';

@Injectable()
export class AuthTokenService {
  constructor(private readonly jwt: JwtService) {}

  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = get('JWT_SECRET').required().asString();
    return this.jwt.signAsync(payload, {
      expiresIn: '2d',
      secret,
    });
  }
}
