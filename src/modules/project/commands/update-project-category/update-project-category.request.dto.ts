import { PartialType } from '@nestjs/swagger';
import { CreateProjectCategoryRequestDto } from '../create-project-category/create-project-category.request.dto';

export class UpdateProjectCategoryRequestDto extends PartialType(
  CreateProjectCategoryRequestDto,
) {}
