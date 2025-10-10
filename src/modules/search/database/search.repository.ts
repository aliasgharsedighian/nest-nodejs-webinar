import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';

@Injectable()
export class PrismaSearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Search products by title or category name
  async searchProjects(query: string) {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        category: true, // project category
        images: {
          include: {
            uploadFile: true, // relation
          },
        },
        coverImage: true, // project cover image
      },
    });
  }

  async searchProducts(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          {
            categories: {
              some: { name: { contains: query, mode: 'insensitive' } },
            },
          },
        ],
      },
      include: {
        categories: true, // include related category info
        images: {
          include: {
            uploadFile: true, // include image file info
          },
        },
      },
    });
  }

  // Search project images by label
  async searchImagesByLabel(query: string) {
    return this.prisma.projectImage.findMany({
      where: {
        label: { contains: query, mode: 'insensitive' },
      },
      include: {
        uploadFile: true, // relation
        project: { select: { id: true, title: true } },
      },
    });
  }
}
