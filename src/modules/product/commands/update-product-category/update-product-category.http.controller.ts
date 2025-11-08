import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { JwtGuard } from 'src/libs/guard';
import { GetUser } from 'src/libs/decorators';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetProductsParamsDto } from '../../queries/find-product/find-product.request.dto';
import { UpdateProductCategoryRequestDto } from './update-product-category.request.dto';
import { UpdateProductCategoryService } from './update-product-category.service';
import { ImageUploadInterceptor } from 'src/libs/common/image-upload.interceptor';

@Controller(routesV1.version)
export class UpdateProductCategoryHttpController {
  constructor(private updateProductCategory: UpdateProductCategoryService) {}
  @ApiOperation({ summary: 'update product category' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(routesV1.product.editProductCategory)
  @ImageUploadInterceptor({ type: 'single', fieldName: 'image' })
  async edit(
    @UploadedFile() image: Express.Multer.File | undefined,
    @Body() body: UpdateProductCategoryRequestDto,
    @GetUser() user: User,
    @Param() params: GetProductsParamsDto,
  ) {
    const result = await this.updateProductCategory.execute(
      body,
      params.id,
      image,
    );
    return result;
  }
}
