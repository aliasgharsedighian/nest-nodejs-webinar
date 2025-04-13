import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInRequestDto } from './signin-user.request.dto';
import * as argon from 'argon2';
import { AuthTokenService } from '../../token.service';

@Injectable()
export class SignInUserService {
  constructor(
    private prisma: PrismaService,
    private tokenService: AuthTokenService,
  ) {}

  async execute(body: SignInRequestDto): Promise<any> {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
      include: {
        profile: true,
      },
    });
    // if user does not exist throw exception
    if (!user) throw new NotFoundException('User not found');
    //compare password
    const pwMatches = await argon.verify(user.password, body.password);
    //if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Access denied');
    //send back the user
    const token = await this.tokenService.signToken(user.id, user.email);
    return {
      statusCode: 200,
      message: 'user login successfully',
      data: token,
    };
  }
}
