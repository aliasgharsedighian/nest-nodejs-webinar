import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSupportRequestDto } from './create-support-request.request.dto';
import { PrismaUserRepository } from '../../database/user.repository';

@Injectable()
export class CreateSupportRequestService {
  constructor(private readonly userRepo: PrismaUserRepository) {}

  async execute(dto: CreateSupportRequestDto, userId?: number) {
    try {
      await this.userRepo.createSupportRequest(dto, userId);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'support request created successfully',
        data: {},
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Service Error: ${error.message}`,
        data: {},
      };
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
