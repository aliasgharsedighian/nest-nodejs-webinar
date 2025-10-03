import { Injectable } from '@nestjs/common';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { PrismaProjectRepository } from '../../database/project.repository';

@Injectable()
export class FindProjectsService {
  constructor(private projectRepo: PrismaProjectRepository) {}

  async execute(command: PaginatedQueryRequestDto) {
    try {
      const page = command.page || 1;
      const limit = command.limit || 12;
      const skip = (+page - 1) * +limit;
      const projects = await this.projectRepo.findAllPaginate(
        page,
        skip,
        limit,
      );
      return projects;
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
