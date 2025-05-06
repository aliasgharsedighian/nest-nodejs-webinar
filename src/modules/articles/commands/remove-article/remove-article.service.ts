import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaArticleRepository } from '../../database/article.repository';
import { User } from '@prisma/client';

@Injectable()
export class RemoveArticleService {
  constructor(private articleRepo: PrismaArticleRepository) {}

  async execute(articleSlug: string, user: User) {
    try {
      const article = await this.articleRepo.findBySlug(articleSlug);
      if (!article) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'article not found',
          data: {},
        };
      }

      const deletedArticle = await this.articleRepo.removeBySlug(articleSlug);
      if (!deletedArticle) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'article not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'article removed successfully',
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
