import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProductRepository } from '../../database/product.repository';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';

@Injectable()
export class FindCategoryProjectService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(command: PaginatedQueryRequestDto) {
    try {
      const page = command.page || 1;
      const limit = command.limit || 12;
      const skip = (+page - 1) * +limit;
      const categoryProduct = await this.productRepo.findAllProductCategory(
        page,
        skip,
        limit,
      );

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
