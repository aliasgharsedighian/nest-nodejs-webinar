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
        where: { id: projectId, published: true },
        include: {
          category: true,
          images: {
            select: {
              label: true,
              uploadFile: {
                select: {
                  id: true,
                  path: true,
                },
              },
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
            label: img.label || '',
          };
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async findByIdAdmin(projectId: number) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: {
          category: true,
          images: {
            select: {
              label: true,
              uploadFile: {
                select: {
                  id: true,
                  path: true,
                },
              },
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
            label: img.label || '',
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

      // ✅ Handle main fields
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

      // ✅ Handle cover image update
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

      // ✅ Upload new images (if any)
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

      // ✅ Update main project info
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
                select: { id: true, path: true },
              },
            },
          },
        },
      });

      // ✅ Handle deleted images
      if (command.deletedImages) {
        const matchedImages = await this.prisma.uploadFile.findMany({
          where: { id: { in: command.deletedImages } },
          select: { id: true, path: true },
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

        // ✅ Enforce max 20 images
        const newImagesLength =
          updatedProject.images.length -
          matchedIds.length +
          (images?.length || 0);
        if (newImagesLength > 20) {
          throw new BadRequestException(
            'Project can not have more than 20 images',
          );
        }

        // ✅ Delete from DB + filesystem
        await this.prisma.uploadFile.deleteMany({
          where: { id: { in: command.deletedImages } },
        });
        await this.fileService.deleteProjectImages(matchedPaths);
      }

      // ✅ Create new project images with labels (optional)
      await Promise.all(
        uploadFileRecords.map((image, index) =>
          this.prisma.projectImage.create({
            data: {
              projectId: updatedProject.id,
              uploadFileId: image.id,
              label: command.labels?.[index]?.toLowerCase() ?? '', // 🟢 NEW: attach label
            },
          }),
        ),
      );

      // ✅ Return updated project with labeled images
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
        images: projectWithImages?.images.map((img) => ({
          id: img.uploadFile.id,
          path: img.uploadFile.path,
          label: img.label ?? '', // 🟢 Include label
        })),
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
        labels, // ✅ add labels from DTO
      } = project as any; // you can also type this to a DTO interface instead of `Project`

      // 1️⃣ Upload cover image
      const uploadedImage =
        await this.fileService.uploadProjectCoverImage(coverImage);
      const uploadFileRecord = await this.prisma.uploadFile.create({
        data: {
          path: `${process.env.DOMAIN_ADDRESS}${uploadedImage.thumbnailPath}`,
          mimetype: uploadedImage.mimetype,
          size: uploadedImage.size,
        },
      });

      // 2️⃣ Upload normal project images
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

      // 3️⃣ Create project
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

      // 4️⃣ Create project images + labels (matched by index)
      await Promise.all(
        uploadFileRecords.map((image, index) =>
          this.prisma.projectImage.create({
            data: {
              projectId: created.id,
              uploadFileId: image.id,
              // ✅ add label if provided (from DTO)
              label: labels?.[index]?.toLowerCase() ?? '',
            },
          }),
        ),
      );

      // 5️⃣ Fetch the project with relations
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
              label: true, // ✅ include label in result
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

      // 6️⃣ Transform output
      return {
        ...projectWithImages,
        images: projectWithImages?.images.map((img) => ({
          id: img.uploadFile.id,
          path: img.uploadFile.path,
          label: img.label, // ✅ include label
        })),
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllAdminPaginate(page: number, skip: number, limit: number) {
    try {
      const [projects, totalCount] = await Promise.all([
        this.prisma.project.findMany({
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
            coverImage: {
              select: {
                id: true,
                path: true,
              },
            },
            images: {
              select: {
                label: true,
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
              label: img.label,
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
            coverImage: {
              select: {
                id: true,
                path: true,
              },
            },
            images: {
              select: {
                label: true,
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
              label: img.label,
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

  async findByLabel(label: string) {
    return this.prisma.projectImage.findMany({
      where: {
        label: label.toLowerCase(),
      },
      select: {
        id: true,
        label: true,
        project: {
          select: {
            id: true,
            title: true,
            category: {
              select: { name: true },
            },
          },
        },
        uploadFile: {
          select: {
            id: true,
            path: true,
            mimetype: true,
            size: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findByProjectAndLabel(projectId: number, label?: string) {
    return this.prisma.projectImage.findMany({
      where: {
        projectId,
        ...(label ? { label: label.toLowerCase() } : {}),
      },
      select: {
        id: true,
        label: true,
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        uploadFile: {
          select: {
            id: true,
            path: true,
            mimetype: true,
            size: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async findAllProjectCategories(page: number, skip: number, limit: number) {
    try {
      const [categoryProject, totalCount] = await Promise.all([
        this.prisma.projectCategory.findMany({
          skip,
          take: limit,
          include: {
            image: true,
          },
        }),
        this.prisma.projectCategory.count(),
      ]);

      return {
        projectCategories: categoryProject.map((category) => ({
          id: category.id,
          name: category.name,
          image: category.image.path || null, // or undefined
        })),
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {
      throw error;
    }
  }

  async findCategoryProjectById(categoryId: number) {
    try {
      const category = await this.prisma.projectCategory.findUnique({
        where: {
          id: categoryId,
        },
        include: {
          image: true,
        },
      });

      return {
        ...category,
        image: category?.image.path || null,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateProjectCategoryById(
    name: string | undefined,
    projectCategoryId: number,
    image: Express.Multer.File | undefined,
  ) {
    try {
      const categoryExists = await this.prisma.projectCategory.findUnique({
        where: {
          id: projectCategoryId,
        },
      });
      if (!categoryExists) {
        return null;
      }
      let updateData: any = {};
      if (name !== undefined) updateData.name = name;

      // 3️⃣ Handle new image upload (optional)
      let newImageRecord: any = null;
      if (image) {
        const uploadedImage =
          await this.fileService.uploadProjectCategoryImage(image);
        newImageRecord = await this.prisma.uploadFile.create({
          data: {
            path: `${process.env.DOMAIN_ADDRESS}${uploadedImage.thumbnailPath}`,
            mimetype: uploadedImage.mimetype,
            size: uploadedImage.size,
          },
        });
      }

      //update project category without image
      const updatedProjectCategory = await this.prisma.projectCategory.update({
        where: {
          id: projectCategoryId,
        },
        data: {
          ...updateData,
        },
        include: {
          image: true,
        },
      });

      if (newImageRecord) {
        //delete old image
        // if (updatedProjectCategory.image.path) {
        //   const oldImage = updatedProjectCategory.image;
        //   console.log(oldImage);
        //   await this.prisma.uploadFile.delete({
        //     where: {
        //       id: oldImage.id,
        //     },
        //   });
        //   // await this.fileService.deleteProjectImages([
        //   //   new URL(oldImage.path).pathname,
        //   // ]);
        // }

        //create new image
        await this.prisma.projectCategory.update({
          where: {
            id: updatedProjectCategory.id,
          },
          data: {
            ...updateData,
            imageId: newImageRecord.id,
          },
          include: {
            image: true,
          },
        });
      }

      const categoryWithImage = await this.prisma.projectCategory.findUnique({
        where: { id: updatedProjectCategory.id },
        include: {
          image: true,
        },
      });

      return {
        ...categoryWithImage,
      };
    } catch (error) {
      throw error;
    }
  }
}
