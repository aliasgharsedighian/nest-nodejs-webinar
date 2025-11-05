import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateExternalProjectImagesCategoryRequestDto } from './create-external-image-categories.request.dto';

@Injectable()
export class CreateExternalProjectImagesCategoryService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(
    command: CreateExternalProjectImagesCategoryRequestDto,
    image: Express.Multer.File,
    user: User,
  ) {
    try {
      const category = await this.projectRepo.createExternalImagesCategory(
        command.name,
        image,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'external project image category created successfully.',
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
