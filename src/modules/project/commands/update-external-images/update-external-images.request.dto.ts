import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  ArrayMaxSize,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateExternalImageRequestDto {
  @Transform(({ value }) => {
    try {
      if (typeof value === 'string') {
        return JSON.parse(value);
      }
      return value;
    } catch {
      return [];
    }
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'You can delete a maximum of 20 images.' })
  @IsNumber({}, { each: true }) // validate that every item is a number
  deletedImages: number[];

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').map((v: string) => v.trim());
      }
    }
    return value;
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly types?: string[];
}
