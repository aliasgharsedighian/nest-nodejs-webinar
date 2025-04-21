import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteProductsParamsDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
