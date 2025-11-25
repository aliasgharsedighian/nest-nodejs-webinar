import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaUserRepository } from '../../database/user.repository';
import { EditUserRequestSupportRequestDto } from './update-request-support.request.dto';

@Injectable()
export class EditRequestService {
  constructor(private userRepo: PrismaUserRepository) {}

  async execute(command: EditUserRequestSupportRequestDto, requestId: number) {
    try {
      const request = await this.userRepo.findSupportRequestById(requestId);
      if (!request) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'user request not found',
        };
      }

      const updatedUser = await this.userRepo.updateUserRequest(
        command,
        requestId,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'user request updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
