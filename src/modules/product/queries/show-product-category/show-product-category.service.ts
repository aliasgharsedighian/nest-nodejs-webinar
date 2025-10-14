import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProductRepository } from '../../database/product.repository';

@Injectable()
export class FindCategoryProjectService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute() {
    try {
      const categoryProduct = await this.productRepo.findAllProductCategory();

      return {
        status: HttpStatus.OK,
        message: 'get product category successfully',
        data: categoryProduct,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
