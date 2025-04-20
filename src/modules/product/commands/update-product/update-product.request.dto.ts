import { PartialType } from '@nestjs/swagger';
import { CreateProductRequestDto } from '../create-product/create-product.request.dto';
import { Prisma } from '@prisma/client';

export class EditProductRequestDto extends PartialType(
  CreateProductRequestDto,
) {}
