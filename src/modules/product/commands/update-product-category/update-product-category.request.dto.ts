import { PartialType } from '@nestjs/swagger';
import { CreateProductCategoryRequestDto } from '../create-product-category/create-product-category.request.dto';

export class UpdateProductCategoryRequestDto extends PartialType(
  CreateProductCategoryRequestDto,
) {}
