import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaArticleRepository } from '../../database/article.repository';

@Injectable()
export class FindArticleCategoryService {
  constructor(private articleRepo: PrismaArticleRepository) {}

  async execute(categoryId: number) {
    try {
      const category =
        await this.articleRepo.findCategoryArticleById(categoryId);
      if (!category) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'article category not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'get article category successfully',
        data: category,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
