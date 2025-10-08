import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchRequestDto {
  @ApiProperty({
    example: 'kitchen',
    description:
      'Search term for product title/category, project title/category, or image labels',
  })
  @IsString()
  @IsNotEmpty()
  readonly query: string;
}
