import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { OptimizedImagesService } from 'src/modules/files-upload/optimizedProductImages.service';
import { Project } from '../domain/entities/create-project.entity';
import { UpdateProjectRequestDto } from '../commands/update-project/update-project.request.dto';

@Injectable()
export class PrismaProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: OptimizedImagesService,
  ) {}

  async findById(projectId: number) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          category: true,
          images: {
            select: {
              uploadFile: true,
            },
          },
          author: true,
          coverImage: true,
          comments: true,
          externalImages: true,
        },
      });

      if (!project) {
        return null;
      }

      return {
        ...project,
        images: project.images.map((img) => {
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

  async updateById(
    command: UpdateProjectRequestDto,
    projectId: number,
    coverImage: Express.Multer.File | undefined,
    images: Express.Multer.File[],
    userId: number,
  ) {
    try {
      let updateData: any = {};
      if (command.title !== undefined) updateData.title = command.title;
      if (command.content !== undefined) updateData.content = command.content;
      if (command.published !== undefined)
        updateData.published = command.published;
      if (command.isFeatured !== undefined)
        updateData.isFeatured = command.isFeatured;
      if (command.implementCity !== undefined)
        updateData.implementCity = command.implementCity;
      if (command.categoryId !== undefined)
        updateData.categoryId = command.categoryId;
      // Handle cover image update
      if (coverImage) {
        const uploadedCoverImage =
          await this.fileService.uploadProjectCoverImage(coverImage);
        const coverImageRecord = await this.prisma.uploadFile.create({
          data: {
            path: `${process.env.DOMAIN_ADDRESS}${uploadedCoverImage.thumbnailPath}`,
            mimetype: uploadedCoverImage.mimetype,
            size: uploadedCoverImage.size,
          },
        });
        updateData.coverImageId = coverImageRecord.id;
      }

      // Handle images upload
      const uploadedImages = await this.fileService.uploadProjectImages(
        images || [],
      );
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

      // Update project main fields
      const updatedProject = await this.prisma.project.update({
        where: { id: projectId },
        data: {
          ...updateData,
          authorId: userId,
        },
        include: {
          category: true,
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

      // Handle deleted images
      if (command.deletedImages) {
        const matchedImages = await this.prisma.uploadFile.findMany({
          where: {
            id: { in: command.deletedImages },
          },
          select: {
            id: true,
            path: true,
          },
        });
        const matchedIds = matchedImages.map((img) => img.id);
        const matchedPaths = matchedImages.map(
          (img) => new URL(img.path).pathname,
        );

        const invalidIds = command.deletedImages.filter(
          (id) => !matchedIds.includes(id),
        );

        if (invalidIds.length > 0) {
          throw new BadRequestException(
            `These image IDs are not part of the project ${projectId}: [${invalidIds.join(', ')}]`,
          );
        }
        // Check upload and exist item not more than 20 images
        const newImagesLength =
          updatedProject.images.length -
          matchedIds.length +
          (images?.length || 0);
        if (newImagesLength > 20) {
          throw new BadRequestException(
            'Project can not have more than 20 images',
          );
        }

        await this.prisma.uploadFile.deleteMany({
          where: {
            id: { in: command.deletedImages },
          },
        });
        await this.fileService.deleteProjectImages(matchedPaths);
      }

      // Create new images
      await Promise.all(
        uploadFileRecords.map((image) =>
          this.prisma.projectImage.create({
            data: {
              projectId: updatedProject.id,
              uploadFileId: image.id,
            },
          }),
        ),
      );

      // Return updated project with images
      const projectWithImages = await this.prisma.project.findUnique({
        where: { id: updatedProject.id },
        include: {
          images: {
            include: {
              uploadFile: true,
            },
          },
          category: true,
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

  async findAllPaginate(page: number, skip: number, limit: number) {
    try {
      const [projects, totalCount] = await Promise.all([
        this.prisma.project.findMany({
          where: {
            published: true,
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
                image: {
                  select: {
                    id: true,
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
          },
        }),
        this.prisma.project.count({
          where: {
            published: true,
          },
        }),
      ]);

      return {
        projects: projects.map((project) => ({
          ...project,
          images: project.images.map((img) => {
            return {
              id: img.uploadFile.id,
              path: img.uploadFile.path,
            };
          }),
        })),
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
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
