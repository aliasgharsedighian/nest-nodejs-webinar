import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleCategoryRequestDto } from './create-article-category.request.dto';
import { User } from '@prisma/client';
import { PrismaArticleRepository } from '../../database/article.repository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CreateArticleCategoryService {
  constructor(private ArticleRepo: PrismaArticleRepository) {}

  async execute(command: CreateArticleCategoryRequestDto, user: User) {
    try {
      const category = await this.ArticleRepo.createCategory(command.name);

      return {
        status: HttpStatus.CREATED,
        message: 'product category created successfully.',
        data: category,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`This category name is exist.`);
        }
      }
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
