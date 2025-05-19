import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { Product } from '../domain/entities/create-product.entity';
import { EditProductRequestDto } from '../commands/update-product/update-product.request.dto';
import { get } from 'env-var';
import { OptimizedImagesService } from 'src/modules/files-upload/optimizedProductImages.service';

@Injectable()
export class PrismaProductRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: OptimizedImagesService,
  ) {}

  async create(
    product: Product,
    images: Express.Multer.File[],
    userId: number,
  ): Promise<any> {
    try {
      const uploadedImages = await this.fileService.uploadProductImages(images);
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

      //create product without image
      const created = await this.prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          price: product.price,
          stock: product.stock,
          show: product.show,
          authorId: userId,
          categories: {
            connect: product.categories.map((item) => {
              return { id: item };
            }),
          },
        },
        include: {
          categories: {
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

      //create product with image
      await Promise.all(
        uploadFileRecords.map((image) =>
          this.prisma.productImage.create({
            data: {
              productId: created.id,
              uploadFileId: image.id,
            },
          }),
        ),
      );

      const productWithImages = await this.prisma.product.findUnique({
        where: { id: created.id },
        include: {
          images: {
            include: {
              uploadFile: true,
            },
          },
          categories: {
            select: {
              id: true,
              name: true,
              image: {
                include: {
                  uploadFile: {
                    select: {
                      id: true,
                      path: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        ...productWithImages,
        images: productWithImages?.images.map((img) => {
          return {
            id: img.uploadFile.id,
            images: img.uploadFile.path,
          };
        }),
        categories: productWithImages?.categories.map((cat) => {
          return {
            id: cat.id,
            name: cat.name,
            image: cat.image[0].uploadFile.path,
          };
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllPaginate(page: number, skip: number, limit: number) {
    try {
      const [products, totalCount] = await Promise.all([
        this.prisma.product.findMany({
          where: {
            show: true,
          },
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            categories: {
              select: {
                id: true,
                name: true,
                image: {
                  include: {
                    uploadFile: {
                      select: {
                        id: true,
                        path: true,
                      },
                    },
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
        this.prisma.product.count({
          where: {
            show: true,
          },
        }),
      ]);

      return {
        products: products.map((product) => ({
          ...product,
          images: product.images.map((img) => {
            return {
              id: img.uploadFile.id,
              path: img.uploadFile.path,
            };
          }),
          categories: product.categories.map((cat) => {
            return {
              id: cat.id,
              name: cat.name,
              image: cat.image[0]?.uploadFile
                ? cat.image[0].uploadFile.path
                : '',
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

  async findById(productId: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: productId,
          // show: true,
        },
        include: {
          categories: {
            select: {
              id: true,
              name: true,
              image: {
                include: {
                  uploadFile: {
                    select: {
                      id: true,
                      path: true,
                    },
                  },
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
      });
      if (!product) {
        return product;
      }
      return {
        ...product,
        images: product?.images.map((img) => {
          return {
            id: img.uploadFile.id,
            path: img.uploadFile.path,
          };
        }),
        categories: product?.categories.map((cat) => {
          return {
            id: cat.id,
            name: cat.name,
            image: cat.image[0]?.uploadFile ? cat.image[0].uploadFile.path : '',
          };
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async updateById(
    product: EditProductRequestDto,
    productId: number,
    images: Express.Multer.File[],
    userId: number,
  ) {
    try {
      let updateData: any = {};
      if (product.title !== undefined) updateData.title = product.title;
      if (product.description !== undefined)
        updateData.description = product.description;
      if (product.price !== undefined) updateData.price = product.price;
      if (product.stock !== undefined) updateData.stock = product.stock;
      if (product.show !== undefined) updateData.show = product.show;

      if (product.categories !== undefined) {
        updateData.categories = {
          set: product.categories.map((id) => ({ id })),
        };
      }

      const uploadedImages = await this.fileService.uploadProductImages(images);
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

      //update product without image
      const updatedProduct = await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ...updateData,
          authorId: userId,
        },
        include: {
          categories: true,
          images: {
            select: {
              uploadFile: {
                select: {
                  path: true,
                  id: true,
                },
              },
            },
          },
        },
      });
      //delete all request to delete

      if (product.deletedImages) {
        const matchedImages = await this.prisma.uploadFile.findMany({
          where: {
            id: { in: product.deletedImages },
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
        const invalidIds = product.deletedImages.filter(
          (id) => !matchedIds.includes(id),
        );

        if (invalidIds.length > 0) {
          throw new BadRequestException(
            `These image IDs are not part of the product ${productId}: [${invalidIds.join(', ')}]`,
          );
        }
        //check upload and exist item not more than 5 item

        const newImagesLength =
          updatedProduct.images.length - matchedIds.length + images.length;
        if (newImagesLength > 5) {
          throw new BadRequestException(
            'Product can not have more than 5 images',
          );
        }

        await this.prisma.uploadFile.deleteMany({
          where: {
            id: { in: product.deletedImages },
          },
        });
        await this.fileService.deleteProductImages(matchedPaths);
      }
      //create new image
      await Promise.all(
        uploadFileRecords.map((image) =>
          this.prisma.productImage.create({
            data: {
              productId: updatedProduct.id,
              uploadFileId: image.id,
            },
          }),
        ),
      );

      const productWithImages = await this.prisma.product.findUnique({
        where: { id: updatedProduct.id },
        include: {
          images: {
            include: {
              uploadFile: true,
            },
          },
          categories: {
            select: {
              id: true,
              name: true,
              image: {
                include: {
                  uploadFile: {
                    select: {
                      id: true,
                      path: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        ...productWithImages,
        images: productWithImages?.images.map((img) => {
          return {
            id: img.uploadFile.id,
            path: img.uploadFile.path,
          };
        }),
        categories: productWithImages?.categories.map((cat) => {
          return {
            id: cat.id,
            name: cat.name,
            image: cat.image[0]?.uploadFile ? cat.image[0].uploadFile.path : '',
          };
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  async removeById(productId: number) {
    try {
      const deletedProduct = await this.prisma.product.delete({
        where: {
          id: productId,
        },
        include: {
          images: {
            include: {
              uploadFile: true,
            },
          },
        },
      });
      await this.fileService.deleteProductImages(
        deletedProduct.images.map(
          (item) => new URL(item.uploadFile.path).pathname,
        ),
      );
      await this.prisma.uploadFile.deleteMany({
        where: {
          id: { in: deletedProduct.images.map((item) => item.uploadFile.id) },
        },
      });

      return deletedProduct;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(name: string, image: Express.Multer.File) {
    const uploadedImage =
      await this.fileService.uploadProductCategoryImage(image);
    const uploadFileRecord = await this.prisma.uploadFile.create({
      data: {
        path: `${get('DOMAIN_ADDRESS').required().asString()}${uploadedImage.thumbnailPath}`,
        mimetype: uploadedImage.mimetype,
        size: uploadedImage.size,
      },
    });
    try {
      // create category without image
      const category = await this.prisma.productCategory.create({
        data: {
          name,
        },
      });

      // create category with image
      await this.prisma.categoryImage.create({
        data: {
          categoryId: category.id,
          uploadFileId: uploadFileRecord.id,
        },
      });

      const categoryWithImage = await this.prisma.productCategory.findUnique({
        where: { id: category.id },
        include: {
          image: {
            include: {
              uploadFile: true,
            },
          },
        },
      });

      return {
        ...categoryWithImage,
        image: categoryWithImage?.image.map((img) => {
          return {
            id: img.uploadFile.id,
            path: img.uploadFile.path,
          };
        }),
      };
    } catch (error) {
      throw error;
    }
  }
}
