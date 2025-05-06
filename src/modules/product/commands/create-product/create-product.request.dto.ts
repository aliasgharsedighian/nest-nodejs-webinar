import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum Stock {
  NEW = 0,
  STOCK = 1,
}

export class CreateProductRequestDto {
  @ApiProperty({
    example: 'iphone 16',
    description: 'name of your product',
  })
  @MaxLength(50)
  @MinLength(4)
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'France', description: 'description for product' })
  @MaxLength(320)
  @MinLength(5)
  @IsString()
  @IsNotEmpty({ message: 'description is required' })
  readonly description: string;

  @ApiProperty({ example: 1000000, description: '' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsNotEmpty({ message: 'Price is required' })
  @Min(1, { message: 'Price must be greater than or equal to 1' })
  readonly price: number;

  @ApiProperty({
    example: 0,
    description: '0 for new product 1 for stock product',
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsNotEmpty()
  @IsEnum(Stock)
  readonly stock: number;

  @ApiProperty({
    example: true,
    description: 'true for show product , false for not showing product',
  })
  @Transform(({ value }) => value === 'true')
  @IsNotEmpty()
  @IsBoolean()
  readonly show: boolean;

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
  categories: number[];
}
