import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCategoryProductsParamsDto } from './show-product-category.http.controller.reuqest.dto';
import { FindCategoryProjectService } from './show-product-category.service';

@Controller(routesV1.version)
export class FindCategoryProjectHttpController {
  constructor(private findProduct: FindCategoryProjectService) {}
  @Get(routesV1.product.showCategoryProduct)
  @ApiOperation({ summary: 'find all category products' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findProductById() {
    const result = await this.findProduct.execute();

    return result;
  }
}
