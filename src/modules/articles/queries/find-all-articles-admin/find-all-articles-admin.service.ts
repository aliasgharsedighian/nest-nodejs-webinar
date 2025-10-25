import { HttpStatus, Injectable } from '@nestjs/common';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { PrismaArticleRepository } from '../../database/article.repository';

@Injectable()
export class FindAllArticlesAdminService {
  constructor(private articleRepo: PrismaArticleRepository) {}

  async findAll(command: PaginatedQueryRequestDto) {
    try {
      const page = command.page || 1;
      const limit = command.limit || 12;
      const skip = (+page - 1) * +limit;
      const articles = await this.articleRepo.findAllAdminPaginate(
        page,
        skip,
        limit,
      );
      return articles;
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }

  async findOne(articleSlug: string) {
    try {
      const artilce = await this.articleRepo.findBySlugAdmin(articleSlug);
      if (!artilce) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'artilce not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'get artilce successfully',
        data: artilce,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
