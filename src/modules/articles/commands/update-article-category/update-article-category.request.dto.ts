import { PartialType } from '@nestjs/swagger';
import { CreateArticleCategoryRequestDto } from '../create-article-category/create-article-category.request.dto';

export class UpdateArticleCategoryRequestDto extends PartialType(
  CreateArticleCategoryRequestDto,
) {}
