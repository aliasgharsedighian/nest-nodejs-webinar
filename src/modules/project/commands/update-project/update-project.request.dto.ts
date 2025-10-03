import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectRequestDto } from '../create-project/create-project.request.dto';
import { ArrayMaxSize, IsArray, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProjectRequestDto extends PartialType(
  CreateProjectRequestDto,
) {
  @ApiProperty({ example: [1], description: 'IDs of images to delete' })
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
  @IsNumber({}, { each: true })
  deletedImages?: number[];
}
