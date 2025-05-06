import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './create-article.request.dto';
import { User } from '@prisma/client';
import { PrismaArticleRepository } from '../../database/article.repository';

@Injectable()
export class CreateArticleService {
  constructor(private articleRepo: PrismaArticleRepository) {}

  async execute(
    body: CreateArticleDto,
    image: Express.Multer.File,
    user: User,
  ) {
    try {
      const article = await this.articleRepo.create(body, image, user.id);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'product created successfully',
        data: article,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        // P2025: Record to connect not found
        throw new BadRequestException('One or more categories do not exist.');
      }
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
