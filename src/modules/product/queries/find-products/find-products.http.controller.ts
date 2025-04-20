import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { FindProductsService } from './find-products.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { ProductsPaginatedResponseDto } from '../../dtos/products.paginated.response.dto';

@Controller(routesV1.version)
export class FindAllProductsHttpController {
  constructor(private findAllProducts: FindProductsService) {}

  @Get(routesV1.product.getAllProducts)
  @ApiOperation({ summary: 'find all products with paginate' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductsPaginatedResponseDto,
  })
  async findProducts(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.findAllProducts.execute(queryParams);

    return {
      statusCode: HttpStatus.OK,
      message: 'get all products successfully',
      data: result,
    };
  }
}
