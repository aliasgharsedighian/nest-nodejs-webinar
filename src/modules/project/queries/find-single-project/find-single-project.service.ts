import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';

@Injectable()
export class FindProjectService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(projectId: number) {
    try {
      const project = await this.projectRepo.findById(projectId);
      if (!project) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'project not found',
          data: {},
        };
      }

      return {
        status: HttpStatus.OK,
        message: 'get project successfully',
        data: project,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
