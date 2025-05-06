import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { Article } from '../domain/entities/create-article.entity';
import { OptimizedImagesService } from 'src/modules/files-upload/optimizedProductImages.service';
import { get } from 'env-var';

@Injectable()
export class PrismaArticleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: OptimizedImagesService,
  ) {}

  async create(body: Article, image: Express.Multer.File, userId: number) {
    try {
      const uploadedImage = await this.fileService.uploadArticleImage(image);

      const uploadFileRecord = await this.prisma.uploadFile.create({
        data: {
          path: `${get('DOMAIN_ADDRESS').required().asString()}${uploadedImage.thumbnailPath}`,
          mimetype: uploadedImage.mimetype,
          size: uploadedImage.size,
        },
      });

      // create article with image
      const created = await this.prisma.article.create({
        data: { ...body, authorId: userId, coverImageId: uploadFileRecord.id },
        include: {
          category: true,
          coverImage: true,
        },
      });

      return {
        ...created,
        coverImage: created.coverImage.path || '',
      };
    } catch (error) {
      throw error;
    }
  }

  async createCategory(name: string) {
    try {
      const category = await this.prisma.articleCategory.create({
        data: {
          name,
        },
      });

      return category;
    } catch (error) {
      throw error;
    }
  }

  async findAllPaginate(page: number, skip: number, limit: number) {
    try {
      const [articles, totalCount] = await Promise.all([
        this.prisma.article.findMany({
          where: {
            published: true,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            coverImage: {
              select: {
                path: true,
              },
            },
          },
        }),
        this.prisma.article.count({
          where: {
            published: true,
          },
        }),
      ]);

      return {
        articles,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {}
  }

  async findById(articleSlug: string) {
    try {
      const article = await this.prisma.article.findUnique({
        where: {
          slug: articleSlug,
        },
        include: {
          coverImage: {
            select: {
              path: true,
            },
          },
          author: {
            select: {
              email: true,
              profile: {
                select: {
                  firstname: true,
                  lastname: true,
                },
              },
            },
          },
        },
      });

      if (!article) {
        return article;
      }
      return {
        ...article,
      };
    } catch (error) {
      throw error;
    }
  }
}
