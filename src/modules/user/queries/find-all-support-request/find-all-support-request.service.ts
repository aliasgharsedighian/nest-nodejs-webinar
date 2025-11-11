import { Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '../../database/user.repository';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';

@Injectable()
export class GetAllSupportRequestsService {
  constructor(private readonly userRepo: PrismaUserRepository) {}

  async execute(command: PaginatedQueryRequestDto) {
    try {
      const page = command.page || 1;
      const limit = command.limit || 12;
      const skip = (+page - 1) * +limit;

      const requestSupport = await this.userRepo.findAllSupportRequests(
        page,
        skip,
        limit,
      );
      return requestSupport;
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
