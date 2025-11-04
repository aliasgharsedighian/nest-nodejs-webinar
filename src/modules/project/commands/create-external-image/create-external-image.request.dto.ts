import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExternalImageDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  type?: number | null;
}
