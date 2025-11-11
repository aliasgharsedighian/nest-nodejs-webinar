import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '../../database/user.repository';

@Injectable()
export class GetSupportRequestByIdService {
  constructor(private readonly userRepo: PrismaUserRepository) {}

  async execute(id: number) {
    try {
      const requestSupport = await this.userRepo.findSupportRequestById(id);
      if (!requestSupport) {
        return {
          statusCode: 404,
          message: 'support request not found',
          data: {},
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'get support request successfully',
        data: requestSupport,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
