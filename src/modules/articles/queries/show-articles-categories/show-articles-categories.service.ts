import { HttpStatus, Injectable } from '@nestjs/common';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { PrismaArticleRepository } from '../../database/article.repository';

@Injectable()
export class FindCategoryArticleService {
  constructor(private articleRepo: PrismaArticleRepository) {}

  async execute(command: PaginatedQueryRequestDto) {
    try {
      const page = command.page || 1;
      const limit = command.limit || 12;
      const skip = (+page - 1) * +limit;
      const categoryArticle = await this.articleRepo.findAllArticleCategory(
        page,
        skip,
        limit,
      );

      return {
        status: HttpStatus.OK,
        message: 'get article category successfully',
        data: categoryArticle,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
