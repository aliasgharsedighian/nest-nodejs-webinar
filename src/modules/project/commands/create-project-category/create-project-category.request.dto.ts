import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProjectCategoryRequestDto {
  @ApiProperty({
    example: 'apartment',
    description: 'name of your project category you add',
  })
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
