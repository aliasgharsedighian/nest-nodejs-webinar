import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProductRepository } from '../../database/product.repository';
import { User } from '@prisma/client';

@Injectable()
export class RemoveProductService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(productId: number, user: User) {
    try {
      if (user.role !== 'ADMIN') {
        throw new ForbiddenException('You are not Allowed!');
      }
      const deletedProduct = await this.productRepo.removeById(productId);
      if (!deletedProduct) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'product not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'product removed successfully',
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
