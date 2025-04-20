import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsParamsDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
