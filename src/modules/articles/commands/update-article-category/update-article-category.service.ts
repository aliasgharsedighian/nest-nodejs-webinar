import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaArticleRepository } from '../../database/article.repository';
import { UpdateArticleCategoryRequestDto } from './update-article-category.request.dto';

@Injectable()
export class UpdateArticleCategoryService {
  constructor(private articleRepo: PrismaArticleRepository) {}

  async execute(
    command: UpdateArticleCategoryRequestDto,
    CategoryArticleId: number,
  ) {
    try {
      const updatedArticleCategory =
        await this.articleRepo.updateArticleCategoryById(
          command.name,
          +CategoryArticleId,
        );
      if (!updatedArticleCategory) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'catgory of article not found',
          data: {},
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'article category updated successfully',
        data: updatedArticleCategory,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
