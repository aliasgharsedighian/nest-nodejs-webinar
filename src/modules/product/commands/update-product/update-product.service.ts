import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProductRepository } from '../../database/product.repository';
import { User } from '@prisma/client';
import { EditProductRequestDto } from './update-product.request.dto';

@Injectable()
export class EditProductService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(command: EditProductRequestDto, productId: number, user: User) {
    try {
      if (user.role !== 'ADMIN') {
        throw new ForbiddenException('You are not Allowed!');
      }
      const product = await this.productRepo.updateById(
        command,
        productId,
        user.id,
      );
      if (!product) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'product not found',
          data: {},
        };
      }
      return {
        status: HttpStatus.OK,
        message: 'product updated successfully',
        data: product,
      };
    } catch (error) {
      throw error;
    }
  }
}
