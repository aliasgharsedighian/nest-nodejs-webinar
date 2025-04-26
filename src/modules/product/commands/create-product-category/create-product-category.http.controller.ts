import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { JwtGuard } from 'src/libs/guard';
import { CreateProductCategoryService } from './create-product-category.service';
import { GetUser } from 'src/libs/decorators';
import { User } from '@prisma/client';
import { CreateProductCategoryRequestDto } from './create-product-category.request.dto';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';

@Controller(routesV1.version)
export class CreateProductCategoryHttpController {
  constructor(private createProductCategory: CreateProductCategoryService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Post(routesV1.product.createProductCategory)
  @Roles('ADMIN')
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
