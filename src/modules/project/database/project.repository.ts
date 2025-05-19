import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { OptimizedImagesService } from 'src/modules/files-upload/optimizedProductImages.service';
import { get } from 'env-var';
import { Project } from '../domain/entities/create-project.entity';

@Injectable()
export class PrismaProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: OptimizedImagesService,
  ) {}

  async create(
    project: Project,
    images: Express.Multer.File[],
    userId: number,
  ) {
    try {
      const {
        title,
        content,
        published,
        isFeatured,
        implementCity,
        categoryId,
      } = project;
      const uploadedImages = await this.fileService.uploadProjectImages(images);
      const uploadFileRecords = await Promise.all(
        uploadedImages.map((image) =>
          this.prisma.uploadFile.create({
            data: {
              path: `${get('DOMAIN_ADDRESS').required().asString()}${image.thumbnailPath}`,
              mimetype: image.mimetype,
              size: image.size,
            },
          }),
        ),
      );

      //create project without image
      const created = await this.prisma.project.create({
        data: {
          title,
          content,
          published,
          isFeatured,
          implementCity,
          authorId: userId,
          categoryId,
          //must be dynamic
          coverImageId: 1,
          viewCount: 0,
        },
        include: {
          category: {
            include: {
              image: true,
            },
          },
          images: {
            select: {
              uploadFile: {
                select: {
                  id: true,
                  path: true,
                },
              },
            },
          },
        },
      });

      //create project without image
    } catch (error) {
      throw error;
    }
  }

  async findAllPaginate() {
    try {
    } catch (error) {
      throw error;
    }
  }

  //title is a unique item
  async findByTitle() {
    try {
    } catch (error) {
      throw error;
    }
  }

  async updateByTitle() {
    try {
    } catch (error) {
      throw error;
    }
  }

  async removeByTitle() {
    try {
    } catch (error) {
      throw error;
    }
  }

  async createCategory(name: string, image: Express.Multer.File) {
    const uploadedImage =
      await this.fileService.uploadProjectCategoryImage(image);
    const uploadFileRecord = await this.prisma.uploadFile.create({
      data: {
        path: `${get('DOMAIN_ADDRESS').required().asString()}${uploadedImage.thumbnailPath}`,
        mimetype: uploadedImage.mimetype,
        size: uploadedImage.size,
      },
    });
    try {
      // create category without image
      const category = await this.prisma.projectCategory.create({
        data: {
          name,
          imageId: uploadFileRecord.id,
        },
        include: {
          image: true,
        },
      });

      return {
        ...category,
      };
    } catch (error) {
      throw error;
    }
  }
}
