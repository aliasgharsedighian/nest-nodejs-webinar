import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';
import { CreateProjectRequestDto } from './create-project.request.dto';
import { User } from '@prisma/client';

@Injectable()
export class CreateProjectService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(
    command: CreateProjectRequestDto,
    images: Express.Multer.File[],
    user: User,
  ) {
    try {
      const project = await this.projectRepo.create(command, images, user.id);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'project created successfully',
        data: project,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        // P2025: Record to connect not found
        throw new BadRequestException('One or more categories do not exist.');
      }
      if (error.code === 'P2003') {
        // P2003: Foreign key constraint failed
        throw new BadRequestException('Invalid category ID provided.');
      }
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
