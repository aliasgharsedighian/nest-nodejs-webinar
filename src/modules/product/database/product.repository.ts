import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { Product } from '../domain/entities/create-product.entity';
import { EditProductRequestDto } from '../commands/update-product/update-product.request.dto';

@Injectable()
export class PrismaProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(product: Product, userId: number): Promise<any> {
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
  }

  async findAllPaginate(page: number, skip: number, limit: number) {
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
  }

  async findById(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
        show: true,
      },
      include: { categories: true },
    });
    return product;
  }

  async updateById(
    product: EditProductRequestDto,
    productId: number,
    userId: number,
  ) {
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
  }

  async removeById() {}

  async createCategory() {}
}
