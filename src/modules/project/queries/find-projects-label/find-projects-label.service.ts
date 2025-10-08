import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';

@Injectable()
export class FindProjectLabelImageService {
  constructor(private readonly projectRepo: PrismaProjectRepository) {}

  async getProjectImages(projectId: number, label?: string) {
    const images = await this.projectRepo.findByProjectAndLabel(
      projectId,
      label,
    );
    if (!images.length) {
      throw new NotFoundException(
        label
          ? `No images found for project ${projectId} with label "${label}"`
          : `No images found for project ${projectId}`,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'get projectId label images successfully',
      data: images,
    };
  }

  async getImagesByLabel(label: string) {
    const images = await this.projectRepo.findByLabel(label);
    if (!images.length) {
      throw new NotFoundException(`No images found with label "${label}"`);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'get all label images successfully',
      data: images,
    };
  }
}
