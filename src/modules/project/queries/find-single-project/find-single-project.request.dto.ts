import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProjectsParamsDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
