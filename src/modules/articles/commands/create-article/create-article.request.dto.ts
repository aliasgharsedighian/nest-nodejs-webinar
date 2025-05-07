import { Transform } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsInt,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
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

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  published: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFeatured?: boolean;

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
