import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginatedQueryRequestDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  @ApiProperty({
    example: 10,
    description: 'Specifies a limit of returned records',
    required: false,
  })
  readonly limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99999)
  @Type(() => Number)
  @ApiProperty({ example: 0, description: 'Page number', required: false })
  readonly page?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'id',
    description: 'Field to sort by',
    required: false,
  })
  readonly sortBy?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'ASC',
    description: 'Sort order (ASC or DESC)',
    required: false,
  })
  readonly order?: 'ASC' | 'DESC';
}
