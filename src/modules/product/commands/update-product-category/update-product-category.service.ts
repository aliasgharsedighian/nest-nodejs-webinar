import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProductRepository } from '../../database/product.repository';
import { User } from '@prisma/client';
import { UpdateProductCategoryRequestDto } from './update-product-category.request.dto';

@Injectable()
export class UpdateProductCategoryService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(
    command: UpdateProductCategoryRequestDto,
    CategoryProductId: number,
    image: Express.Multer.File | undefined,
  ) {
    try {
      const updatedProductCategory =
        await this.productRepo.updateProductCategoryById(
          command.name,
          CategoryProductId,
          image,
        );
      if (!updatedProductCategory) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'catgory of product not found',
          data: {},
        };
      }
      return {
        status: HttpStatus.OK,
        message: 'product category updated successfully',
        data: updatedProductCategory,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
