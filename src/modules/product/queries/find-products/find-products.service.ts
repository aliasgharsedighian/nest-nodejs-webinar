import { Injectable } from '@nestjs/common';
import { PrismaProductRepository } from '../../database/product.repository';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';

@Injectable()
export class FindProductsService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(command: PaginatedQueryRequestDto) {
    try {
      const page = command.page || 1;
      const limit = command.limit || 12;
      const skip = (+page - 1) * +limit;
      const products = await this.productRepo.findAllPaginate(
        page,
        skip,
        limit,
      );
      return products;
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
