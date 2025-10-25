import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetArticleCategoryParamsDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
