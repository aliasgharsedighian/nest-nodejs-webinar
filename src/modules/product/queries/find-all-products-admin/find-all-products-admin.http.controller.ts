import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { ProductsPaginatedResponseDto } from '../../dtos/products.paginated.response.dto';
import { GetProductsParamsDto } from '../find-product/find-product.request.dto';
import { FindAllProductsAdminService } from './find-all-products-admin.service';

@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
@Controller(routesV1.version)
export class FindAllAdminProductsHttpController {
  constructor(private findAdminProducts: FindAllProductsAdminService) {}

  @Get(routesV1.product.getAllAdminProducts)
  @ApiOperation({ summary: 'find all products with paginate' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProductsPaginatedResponseDto,
  })
  async findProductsAdmin(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.findAdminProducts.findAll(queryParams);

    return {
      statusCode: HttpStatus.OK,
      message: 'get all products successfully',
      data: result,
    };
  }

  @Get(routesV1.product.showAdminProduct)
  async findProductAdminById(@Param() params: GetProductsParamsDto) {
    const result = await this.findAdminProducts.findOne(params.id);

    return result;
  }
}
