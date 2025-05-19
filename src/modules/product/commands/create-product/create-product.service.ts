import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProductRequestDto } from './create-product.request.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaProductRepository } from '../../database/product.repository';

@Injectable()
export class CreateProductService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(
    command: CreateProductRequestDto,
    images: Express.Multer.File[],
    user: User,
  ) {
    try {
      const product = await this.productRepo.create(command, images, user.id);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'product created successfully',
        data: product,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`title name must be a unique`);
      }
      if (error.code === 'P2025') {
        // P2025: Record to connect not found
        throw new BadRequestException('One or more categories do not exist.');
      }
      if (error.code === 'P2003') {
        // P2003: Foreign key constraint failed
        throw new BadRequestException('Invalid category ID provided.');
      }
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
