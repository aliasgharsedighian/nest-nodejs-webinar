import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';

@Injectable()
export class FindExternalProjectImageCategoryService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(categoryId: number) {
    try {
      const category =
        await this.projectRepo.findExternalCategoryImageProjectById(categoryId);
      if (!category) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'external project image category not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'get external project image category successfully',
        data: category,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
