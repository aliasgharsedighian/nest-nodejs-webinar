import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaProjectRepository } from '../../database/project.repository';
import { UpdateProjectCategoryRequestDto } from './update-project-category.request.dto';

@Injectable()
export class UpdateProjectCategoryService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(
    command: UpdateProjectCategoryRequestDto,
    CategoryProjectId: number,
    image: Express.Multer.File | undefined,
  ) {
    try {
      const updatedProjectCategory =
        await this.projectRepo.updateProjectCategoryById(
          command.name,
          CategoryProjectId,
          image,
        );
      if (!updatedProjectCategory) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'catgory of project not found',
          data: {},
        };
      }
      return {
        status: HttpStatus.OK,
        message: 'project category updated successfully',
        data: updatedProjectCategory,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
