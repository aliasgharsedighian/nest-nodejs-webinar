import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';

@Injectable()
export class CreateUserService {
  constructor(private prisma: PrismaService) {}
  async execute(email?: string, id?: number): Promise<any> {
    try {
      if (!id && !email) {
        return null;
      }
      if (email) {
        const user = await this.prisma.user.findUnique({
          where: {
            email,
          },
          include: {
            profile: true,
          },
        });
        return user;
      }
      if (id) {
        const user = await this.prisma.user.findUnique({
          where: {
            id,
          },
          include: {
            profile: true,
          },
        });
        return user;
      }
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
