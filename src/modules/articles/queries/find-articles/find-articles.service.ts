import { Injectable } from '@nestjs/common';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { PrismaArticleRepository } from '../../database/article.repository';

@Injectable()
export class FindArticlesService {
  constructor(private articleRepo: PrismaArticleRepository) {}

  async execute(command: PaginatedQueryRequestDto) {
    try {
      const page = command.page || 1;
      const limit = command.limit || 8;
      const skip = (+page - 1) * +limit;
      const artiles = await this.articleRepo.findAllPaginate(page, skip, limit);
      return artiles;
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
