import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { Article } from '../domain/entities/create-article.entity';
import { OptimizedImagesService } from 'src/modules/files-upload/optimizedProductImages.service';
import { get } from 'env-var';
import { EditArticleRequestDto } from '../commands/update-article/update-article.request.dto';

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
            deletedAt: null,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
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

  async findBySlug(articleSlug: string) {
    try {
      const article = await this.prisma.article.findUnique({
        where: {
          slug: articleSlug,
          deletedAt: null,
        },
        include: {
          coverImage: {
            select: {
              path: true,
              id: true,
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

  async updateBySlug(
    article: EditArticleRequestDto,
    articleSlug: string,
    image: Express.Multer.File,
    userId: number,
    coverImage,
  ) {
    try {
      let updateData: any = {};
      if (article.title !== undefined) updateData.title = article.title;
      if (article.slug !== undefined) updateData.slug = article.slug;
      if (article.excerpt !== undefined) updateData.excerpt = article.excerpt;
      if (article.published !== undefined)
        updateData.published = article.published;
      if (article.body !== undefined) updateData.body = article.body;
      if (article.categoryId !== undefined)
        updateData.categoryId = article.categoryId;

      if (image) {
        const uploadedImage = await this.fileService.uploadArticleImage(image);
        const uploadFileRecord = await this.prisma.uploadFile.create({
          data: {
            path: `${get('DOMAIN_ADDRESS').required().asString()}${uploadedImage.thumbnailPath}`,
            mimetype: uploadedImage.mimetype,
            size: uploadedImage.size,
          },
        });
        updateData.coverImageId = uploadFileRecord.id;

        //delete file form dir

        const imagePath = new URL(coverImage.path).pathname;

        await this.fileService.deleteArticleCoverImage(imagePath);
      }

      //update article with image
      const updatedArticle = await this.prisma.article.update({
        where: { slug: articleSlug },
        data: {
          ...updateData,
          authorId: userId,
        },
        include: {
          category: true,
          coverImage: true,
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

      if (image) {
        //after updated new image delete from database to protect from foreing key
        await this.prisma.uploadFile.delete({
          where: {
            id: coverImage.id,
          },
        });
      }

      return {
        ...updatedArticle,
        coverImage: updatedArticle.coverImage.path || '',
      };
    } catch (error) {
      throw error;
    }
  }

  async removeBySlug(articleSlug: string) {
    const softDelete = this.prisma.article.update({
      where: { slug: articleSlug },
      data: {
        deletedAt: new Date(),
      },
    });

    return softDelete;
  }
}
