import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';
import { CreateProjectCategoryRequestDto } from './create-project-category.request.dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CreateProjectCategoryService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(
    command: CreateProjectCategoryRequestDto,
    image: Express.Multer.File,
    user: User,
  ) {
    try {
      const category = await this.projectRepo.createCategory(
        command.name,
        image,
      );

      return {
        status: HttpStatus.CREATED,
        message: 'project category created successfully.',
        data: category,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`This category name is exist.`);
        }
      }
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
