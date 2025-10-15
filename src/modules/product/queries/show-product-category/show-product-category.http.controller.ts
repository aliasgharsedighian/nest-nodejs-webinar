import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCategoryProductsParamsDto } from './show-product-category.http.controller.reuqest.dto';
import { FindCategoryProjectService } from './show-product-category.service';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';

@Controller(routesV1.version)
export class FindCategoryProjectHttpController {
  constructor(private findProduct: FindCategoryProjectService) {}
  @Get(routesV1.product.showCategoryProduct)
  @ApiOperation({ summary: 'find all category products' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findProductById(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.findProduct.execute(queryParams);

    return result;
  }
}
