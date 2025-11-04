import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * DTO sent to the repository/service for creating a single ExternalImage
 */
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

/**
 * DTO for each image item when sending multiple images in one request
 */
export class CreateExternalImageItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  type?: number | null;
}

/**
 * Main request DTO for the unified endpoint
 * Supports:
 * - Single upload: projectId + type
 * - Multiple upload: projectId + images[]
 */
export class CreateExternalImageRequestDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId!: number;

  /**
   * Optional single type (used for single upload)
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  type?: number | null;

  /**
   * Optional array of images (used for multiple upload)
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExternalImageItemDto)
  images?: CreateExternalImageItemDto[];
}
