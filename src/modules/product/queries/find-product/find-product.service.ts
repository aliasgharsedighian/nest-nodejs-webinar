import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProductRepository } from '../../database/product.repository';

@Injectable()
export class FindProductService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(productId: number) {
    try {
      const product = await this.productRepo.findById(productId);
      if (!product) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'product not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'get product successfully',
        data: product,
      };
    } catch (error) {
      throw error;
    }
  }
}
