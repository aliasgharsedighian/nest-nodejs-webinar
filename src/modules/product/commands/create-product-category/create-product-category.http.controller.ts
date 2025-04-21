import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { JwtGuard } from 'src/libs/guard';
import { CreateProductCategoryService } from './create-product-category.service';
import { GetUser } from 'src/libs/decorators';
import { User } from '@prisma/client';
import { CreateProductCategoryRequestDto } from './create-product-category.request.dto';

@Controller(routesV1.version)
export class CreateProductCategoryHttpController {
  constructor(private createProductCategory: CreateProductCategoryService) {}

  @UseGuards(JwtGuard)
  @Post(routesV1.product.createProductCategory)
  @ApiOperation({ summary: 'create product category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: '',
  })
  async create(
    @Body() body: CreateProductCategoryRequestDto,
    @GetUser() user: User,
  ) {
    const result = await this.createProductCategory.execute(body, user);
    return result;
  }
}
