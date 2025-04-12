import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpRequestDto } from './create-user.request.dto';

@Injectable()
export class CreateUserService {
  constructor(private prisma: PrismaService) {}

  async execute(body: SignUpRequestDto): Promise<any> {
    return { res: 'res' };
  }
}
