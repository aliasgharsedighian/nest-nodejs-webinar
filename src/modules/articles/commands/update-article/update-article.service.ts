import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaArticleRepository } from '../../database/article.repository';
import { User } from '@prisma/client';
import { EditArticleRequestDto } from './update-article.request.dto';

@Injectable()
export class EditArticleService {
  constructor(private articleRepo: PrismaArticleRepository) {}
  async execute(
    command: EditArticleRequestDto,
    articleSlug: string,
    image: Express.Multer.File,
    user: User,
  ) {
    try {
      const article = await this.articleRepo.findBySlug(articleSlug);
      if (!article) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'article not found',
          data: {},
        };
      }

      const updatedArticle = await this.articleRepo.updateBySlug(
        command,
        articleSlug,
        image,
        user.id,
        article.coverImage,
      );
      if (!updatedArticle) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'article not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'product updated successfully',
        data: updatedArticle,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
