import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { JwtGuard } from 'src/libs/guard';
import { CreateProductCategoryService } from './create-product-category.service';
import { GetUser } from 'src/libs/decorators';
import { User } from '@prisma/client';
import { CreateProductCategoryRequestDto } from './create-product-category.request.dto';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageUploadInterceptor } from 'src/libs/common/image-upload.interceptor';

@Controller(routesV1.version)
export class CreateProductCategoryHttpController {
  constructor(private createProductCategory: CreateProductCategoryService) {}
  @ApiOperation({ summary: 'create product category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(routesV1.product.createProductCategory)
  @ImageUploadInterceptor({ type: 'single', fieldName: 'image' })
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateProductCategoryRequestDto,
    @GetUser() user: User,
  ) {
    if (!image) {
      throw new BadRequestException('Check your image(s)');
    }
    const result = await this.createProductCategory.execute(body, image, user);
    return result;
  }
}
