import { Injectable } from '@nestjs/common';
import { AuthTokenService } from '../../token.service';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';

interface UserGoogleReturnType {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

@Injectable()
export class CreateGoogleUserService {
  constructor(
    private prisma: PrismaService,
    private tokenService: AuthTokenService,
  ) {}

  async execute(req: UserGoogleReturnType) {
    try {
      let token = {
        accessToken: '',
        refreshToken: '',
      };
      let statusCode = 200;
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: req.email }, { googleId: req.sub }],
        },
      });

      if (!user) {
        statusCode = 201;
        user = await this.prisma.user.create({
          data: {
            email: req.email,
            googleId: req.sub,
            role: 'USER',
            profile: {
              create: {
                firstname: req.given_name,
                lastname: req.family_name,
              },
            },
          },
        });
      }

      if (user.email) {
        token = await this.tokenService.signToken(user.id, user.email);
      }
      if (user.phoneNumber) {
        token = await this.tokenService.signToken(user.id, user.phoneNumber);
      }

      return {
        statusCode,
        message: `Google ${statusCode === 200 ? 'login' : 'create'} successfully`,
        data: token,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
