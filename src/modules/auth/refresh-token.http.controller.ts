import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { routesV1 } from 'src/config/app.routes';
import { get } from 'env-var';

@Controller(routesV1.version)
export class AuthRefreshController {
  constructor(private readonly jwtService: JwtService) {}

  @HttpCode(HttpStatus.OK)
  @Post(routesV1.auth.refreshToken)
  async refresh(@Body() body: { refreshToken: string }) {
    try {
      const secret = get('JWT_SECRET').required().asString();
      const refreshSecret = get('JWT_REFRESH_SECRET').required().asString();

      const payload = await this.jwtService.verifyAsync(body.refreshToken, {
        secret: refreshSecret,
      });

      const newAccessToken = await this.jwtService.signAsync(
        {
          email: payload.email,
          sub: payload.sub,
        },
        {
          secret: secret,
          expiresIn: '2d',
        },
      );

      return { accessToken: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
