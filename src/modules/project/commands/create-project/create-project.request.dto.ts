import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectRequestDto {
  @ApiProperty({
    example: 'chitgar project',
    description: 'name of your project',
  })
  @MaxLength(50)
  @MinLength(4)
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  readonly title: string;

  @ApiProperty({
    example: 'projectBody',
    description: 'body content for projects',
  })
  @MaxLength(320)
  @MinLength(5)
  @IsString()
  @IsNotEmpty({ message: 'content is required' })
  readonly content: string;

  @ApiProperty({
    example: true,
    description: 'true for show projects , false for not showing projects',
  })
  @Transform(({ value }) => value === 'true')
  @IsNotEmpty()
  @IsBoolean()
  readonly published: boolean;

  @ApiProperty({
    example: true,
    description:
      'true for showing in top projects , false for not showing in top projects',
  })
  @Transform(({ value }) => value === 'true')
  @IsNotEmpty()
  @IsBoolean()
  readonly isFeatured: boolean;

  @ApiProperty({
    example: 'tehran',
    description: 'name of city implement Project',
  })
  @MaxLength(50)
  @MinLength(2)
  @IsNotEmpty({ message: 'implementCity is required' })
  @IsString()
  readonly implementCity: string;

  @ApiProperty({ example: [1], description: 'number of product category' })
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
  @IsArray()
  @IsNumber({}, { each: true }) // validate that every item is a number
  categoryId: number;
}
