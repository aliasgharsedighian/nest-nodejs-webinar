import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { EditProductService } from './update-product.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/libs/decorators';
import { EditProductRequestDto } from './update-product.request.dto';
import { GetProductsParamsDto } from '../../queries/find-product/find-product.request.dto';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageUploadInterceptor } from 'src/libs/common/image-upload.interceptor';

@Controller(routesV1.version)
export class EditProductByIdHttpController {
  constructor(private editProduct: EditProductService) {}
  @ApiOperation({ summary: 'edit product with id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(routesV1.product.editProduct)
  @ImageUploadInterceptor({ type: 'array', fieldName: 'images', maxCount: 5 })
  async edit(
    @Body() body: EditProductRequestDto,
    @Param() params: GetProductsParamsDto,
    @GetUser() user: User,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const result = await this.editProduct.execute(
      body,
      params.id,
      images,
      user,
    );

    return result;
  }
}
