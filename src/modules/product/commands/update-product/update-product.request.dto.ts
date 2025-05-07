import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductRequestDto } from '../create-product/create-product.request.dto';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class EditProductRequestDto extends PartialType(
  CreateProductRequestDto,
) {
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
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: 'You can delete a maximum of 5 images.' })
  @IsNumber({}, { each: true }) // validate that every item is a number
  deletedImages: number[];
}
