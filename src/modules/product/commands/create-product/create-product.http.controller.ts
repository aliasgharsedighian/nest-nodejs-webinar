import {
  Controller,
  Body,
  ConflictException as ConflictHttpException,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { CreateProductRequestDto } from './create-product.request.dto';
import { User } from '@prisma/client';
import { GetUser } from 'src/libs/decorators';
import { JwtGuard } from 'src/libs/guard';
import { CreateProductService } from './create-product.service';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageUploadInterceptor } from 'src/libs/common/image-upload.interceptor';

@Controller(routesV1.version)
export class CreateProductHttpController {
  constructor(private createProduct: CreateProductService) {}

  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Product Already Exist',
    type: '',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(routesV1.product.createProduct)
  @ImageUploadInterceptor({ type: 'array', fieldName: 'images', maxCount: 5 })
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: CreateProductRequestDto,
    @GetUser() user: User,
  ) {
    if (!images || images.length === 0) {
      throw new BadRequestException('Check your image(s)');
    }
    const result = await this.createProduct.execute(body, images, user);

    return result;
  }
}
