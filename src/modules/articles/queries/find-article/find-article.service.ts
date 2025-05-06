import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaArticleRepository } from '../../database/article.repository';

@Injectable()
export class FindArticleService {
  constructor(private articleRepo: PrismaArticleRepository) {}

  async execute(articleSlug: string) {
    try {
      const article = await this.articleRepo.findById(articleSlug);
      if (!article) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'article not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'get article successfully',
        data: article,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
