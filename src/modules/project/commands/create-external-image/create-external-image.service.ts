import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';
import { CreateExternalImageDto } from './create-external-image.request.dto';

@Injectable()
export class CreateExternalProjectImagesService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(
    before: Express.Multer.File | null,
    after: Express.Multer.File,
    body: CreateExternalImageDto,
  ) {
    try {
      const externalImage = await this.projectRepo.createExternalImage(
        body,
        after,
        before,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'external project images created successfully',
        data: externalImage,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
