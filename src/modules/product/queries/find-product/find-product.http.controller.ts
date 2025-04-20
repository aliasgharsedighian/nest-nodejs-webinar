import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { FindProductService } from './find-product.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetProductsParamsDto } from './find-product.request.dto';

@Controller(routesV1.version)
export class FindProductByIdHttpController {
  constructor(private findProduct: FindProductService) {}
  @Get(routesV1.product.showProduct)
  @ApiOperation({ summary: 'find single product with id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findProductById(@Param() params: GetProductsParamsDto) {
    const result = await this.findProduct.execute(params.id);

    return result;
  }
}
