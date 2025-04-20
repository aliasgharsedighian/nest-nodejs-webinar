import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { Product } from '../domain/entities/create-product.entity';

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

  async findAll() {}

  async findById() {}

  async updateById() {}

  async removeById() {}

  async createCategory() {}
}
