import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { OptimizedImagesService } from 'src/modules/files-upload/optimizedProductImages.service';
import { Project } from '../domain/entities/create-project.entity';

@Injectable()
export class PrismaProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: OptimizedImagesService,
  ) {}

  async create(
    project: Project,
    coverImage: Express.Multer.File,
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

      const uploadedImage =
        await this.fileService.uploadProjectCoverImage(coverImage);
      const uploadFileRecord = await this.prisma.uploadFile.create({
        data: {
          path: `${process.env.DOMAIN_ADDRESS}${uploadedImage.thumbnailPath}`,
          mimetype: uploadedImage.mimetype,
          size: uploadedImage.size,
        },
      });

      const uploadedImages = await this.fileService.uploadProjectImages(images);
      const uploadFileRecords = await Promise.all(
        uploadedImages.map((image) =>
          this.prisma.uploadFile.create({
            data: {
              path: `${process.env.DOMAIN_ADDRESS}${image.thumbnailPath}`,
              mimetype: image.mimetype,
              size: image.size,
            },
          }),
        ),
      );

      //create project without images
      const created = await this.prisma.project.create({
        data: {
          title,
          content,
          published,
          isFeatured,
          implementCity,
          authorId: userId,
          categoryId,
          coverImageId: uploadFileRecord.id,
          viewCount: 0,
        },
      });

      //create project with images
      await Promise.all(
        uploadFileRecords.map((image) =>
          this.prisma.projectImage.create({
            data: {
              projectId: created.id,
              uploadFileId: image.id,
            },
          }),
        ),
      );

      //create external images if exist

      const projectWithImages = await this.prisma.project.findUnique({
        where: { id: created.id },
        include: {
          category: {
            select: {
              id: true,
              image: {
                select: {
                  path: true,
                },
              },
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
          author: {
            select: {
              email: true,
              profile: true,
            },
          },
          coverImage: true,
          comments: true,
          externalImages: true,
        },
      });

      return {
        ...projectWithImages,
        images: projectWithImages?.images.map((img) => {
          return {
            id: img.uploadFile.id,
            images: img.uploadFile.path,
          };
        }),
      };
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
        path: `${process.env.DOMAIN_ADDRESS}${uploadedImage.thumbnailPath}`,
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
