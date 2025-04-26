import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProductRequestDto } from './create-product.request.dto';
import { User } from '@prisma/client';
import { PrismaProductRepository } from '../../database/product.repository';

@Injectable()
export class CreateProductService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(command: CreateProductRequestDto, user: User) {
    try {
      const product = await this.productRepo.create(command, user.id);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'product created successfully',
        data: product,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        // P2025: Record to connect not found
        throw new BadRequestException('One or more categories do not exist.');
      }
      throw new Error(`Service Error: ${error.message}`);
    }
  }
}
