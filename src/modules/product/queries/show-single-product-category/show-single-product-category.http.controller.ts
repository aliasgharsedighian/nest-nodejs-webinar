import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetProductCategoryParamsDto } from './show-single-product-category.request.dto';
import { FindProductCategoryService } from './show-single-product-category.service';

@Controller(routesV1.version)
export class FindProductCategoryByIdHttpController {
  constructor(private findProduct: FindProductCategoryService) {}
  @Get(routesV1.product.showProductCategory)
  @ApiOperation({ summary: 'find single product category with id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findProducCategorytById(@Param() params: GetProductCategoryParamsDto) {
    const result = await this.findProduct.execute(params.id);

    return result;
  }
}
