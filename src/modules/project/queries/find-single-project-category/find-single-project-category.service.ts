import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';

@Injectable()
export class FindProjectCategoryService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(categoryId: number) {
    try {
      const category =
        await this.projectRepo.findCategoryProjectById(categoryId);
      if (!category) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'project category not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'get project category successfully',
        data: category,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
