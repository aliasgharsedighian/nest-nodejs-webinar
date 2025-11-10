import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';
import { UpdateExternalImageRequestDto } from './update-external-images.request.dto';
import { User } from '@prisma/client';

@Injectable()
export class UpdateExternalProjectImagesService {
  constructor(private readonly projectRepo: PrismaProjectRepository) {}

  async execute(
    body: UpdateExternalImageRequestDto,
    projectId: number,
    files: {
      beforeImages?: Express.Multer.File[];
      afterImages: Express.Multer.File[];
    },
    user: User,
  ) {
    try {
      const project = await this.projectRepo.findByIdAdmin(projectId);
      if (!project) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'external image not found',
          data: {},
        };
      }

      const updatedExternalImage =
        await this.projectRepo.updateExternalImageById(
          body,
          projectId,
          files,
          user.id,
        );
      if (!updatedExternalImage) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'external image not found',
          data: {},
        };
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'external images updated successfully',
        data: updatedExternalImage,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
