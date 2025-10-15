import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProductRepository } from '../../database/product.repository';
import { User } from '@prisma/client';
import { EditProductRequestDto } from './update-product.request.dto';

@Injectable()
export class EditProductService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(
    command: EditProductRequestDto,
    productId: number,
    images: Express.Multer.File[],
    user: User,
  ) {
    try {
      const product = await this.productRepo.findByIdAdmin(productId);
      if (!product) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'product not found',
          data: {},
        };
      }

      const updatedProduct = await this.productRepo.updateById(
        command,
        productId,
        images,
        user.id,
      );
      if (!updatedProduct) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'product not found',
          data: {},
        };
      }
      return {
        status: HttpStatus.OK,
        message: 'product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
