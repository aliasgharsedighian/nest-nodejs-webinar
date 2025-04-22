import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { Product } from '../domain/entities/create-product.entity';
import { EditProductRequestDto } from '../commands/update-product/update-product.request.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(product: Product, userId: number): Promise<any> {
    try {
      const created = await this.prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          price: product.price,
          images: product.images,
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
          categories: true,
        },
      });
      return created;
    } catch (error) {
      throw error;
    }
  }

  async findAllPaginate(page: number, skip: number, limit: number) {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          show: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          categories: true,
        },
      });
      const totalCount = products.length;

      return {
        products,
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
          show: true,
        },
        include: { categories: true },
      });
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateById(
    product: EditProductRequestDto,
    productId: number,
    userId: number,
  ) {
    try {
      let updateData: any = {};
      if (product.title !== undefined) updateData.title = product.title;
      if (product.description !== undefined)
        updateData.description = product.description;
      if (product.price !== undefined) updateData.price = product.price;
      if (product.images !== undefined) updateData.images = product.images;
      if (product.stock !== undefined) updateData.stock = product.stock;
      if (product.show !== undefined) updateData.show = product.show;

      if (product.categories !== undefined) {
        updateData.categories = {
          set: product.categories.map((id) => ({ id })),
        };
      }
      console.log({ ...updateData, authorId: userId });
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
        },
      });
      return updatedProduct;
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
      });
      return deletedProduct;
    } catch (error) {
      throw error;
    }
  }

  async createCategory(name: string) {
    try {
      const category = await this.prisma.productCategory.create({
        data: {
          name,
        },
      });

      return category;
    } catch (error) {
      throw error;
    }
  }
}
