import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArticleCategoryRequestDto {
  @ApiProperty({
    example: 'shoes',
    description: 'name of your article category you add',
  })
  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
