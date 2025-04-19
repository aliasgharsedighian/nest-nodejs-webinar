import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProductRequestDto } from './create-product.request.dto';
import { User } from '@prisma/client';
import { PrismaProductRepository } from '../../database/product.repository';

@Injectable()
export class CreateProductService {
  constructor(private productRepo: PrismaProductRepository) {}

  async execute(command: CreateProductRequestDto, user: User) {
    try {
      if (user.role !== 'ADMIN') {
        throw new ForbiddenException('You are not Allowed!');
      }
      const product = await this.productRepo.create(command, user.id);
      return product;
    } catch (error) {
      throw error;
    }
  }
}
