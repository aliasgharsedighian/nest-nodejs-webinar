import { ApiProperty } from '@nestjs/swagger';
import { ProductsResponseDto } from './products.response.dto';

export class ProductsPaginatedResponseDto {
  @ApiProperty({ type: ProductsResponseDto, isArray: true })
  readonly data: readonly ProductsResponseDto[];
}
