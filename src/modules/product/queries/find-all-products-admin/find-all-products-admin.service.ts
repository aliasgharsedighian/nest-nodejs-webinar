import { HttpStatus, Injectable } from '@nestjs/common';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { PrismaProductRepository } from '../../database/product.repository';

@Injectable()
export class FindAllProductsAdminService {
  constructor(private productRepo: PrismaProductRepository) {}

  async findAll(command: PaginatedQueryRequestDto) {
    try {
      const page = command.page || 1;
      const limit = command.limit || 12;
      const skip = (+page - 1) * +limit;
      const projects = await this.productRepo.findAllAdminPaginate(
        page,
        skip,
        limit,
      );
      return projects;
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }

  async findOne(projectId: number) {
    try {
      const project = await this.productRepo.findByIdAdmin(projectId);
      if (!project) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'project not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'get project successfully',
        data: project,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
