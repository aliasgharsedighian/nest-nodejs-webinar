import { HttpStatus, Injectable } from '@nestjs/common';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { PrismaProjectRepository } from '../../database/project.repository';

@Injectable()
export class FindAllExternalImageProjectCategoriesService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(command: PaginatedQueryRequestDto) {
    try {
      const page = command.page || 1;
      const limit = command.limit || 12;
      const skip = (+page - 1) * +limit;
      const categoryProject =
        await this.projectRepo.findAllExternalProjectImageCategories(
          page,
          skip,
          limit,
        );

      return {
        status: HttpStatus.OK,
        message: 'get external project image category successfully',
        data: categoryProject,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
