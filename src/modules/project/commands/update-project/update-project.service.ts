import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';
import { User } from '@prisma/client';
import { UpdateProjectRequestDto } from './update-project.request.dto';

@Injectable()
export class UpdateProjectService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(
    command: UpdateProjectRequestDto,
    projectId: number,
    coverImage: Express.Multer.File | undefined,
    images: Express.Multer.File[],
    user: User,
  ) {
    try {
      const project = await this.projectRepo.findById(projectId);
      if (!project) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'project not found',
          data: {},
        };
      }

      const updatedProject = await this.projectRepo.updateById(
        command,
        projectId,
        coverImage,
        images,
        user.id,
      );
      if (!updatedProject) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'project not found',
          data: {},
        };
      }
      return {
        status: HttpStatus.OK,
        message: 'project updated successfully',
        data: updatedProject,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
