import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaProductRepository } from '../../database/product.repository';
import { CreateProductCategoryRequestDto } from './create-product-category.request.dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CreateProductCategoryService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(
    command: CreateProductCategoryRequestDto,
    image: Express.Multer.File,
    user: User,
  ) {
    try {
      const category = await this.productRepo.createCategory(
        command.name,
        image,
      );

      return {
        status: HttpStatus.CREATED,
        message: 'product category created successfully.',
        data: category,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`This category name is exist.`);
        }
      }
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
