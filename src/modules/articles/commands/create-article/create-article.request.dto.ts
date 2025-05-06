import { Transform } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateArticleDto {
  @MaxLength(50)
  @MinLength(4)
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @MaxLength(50)
  @MinLength(4)
  @IsNotEmpty({ message: 'excerpt is required' })
  @IsString()
  excerpt: string;

  @IsString()
  body: string;

  @Transform(({ value }) => value === 'true' || value === 'false')
  @IsBoolean()
  published: boolean;

  @Transform(({ value }) => {
    try {
      if (typeof value === 'string') {
        return JSON.parse(value);
      }
      return value;
    } catch {
      return 0;
    }
  })
  @IsInt()
  categoryId: number;
}
