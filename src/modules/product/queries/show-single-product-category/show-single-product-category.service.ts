import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProductRepository } from '../../database/product.repository';

@Injectable()
export class FindProductCategoryService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(categoryId: number) {
    try {
      const category =
        await this.productRepo.findCategoryProductById(categoryId);
      if (!category) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'product category not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'get product category successfully',
        data: category,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
