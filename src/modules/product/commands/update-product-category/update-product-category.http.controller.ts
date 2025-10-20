import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
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

@Controller(routesV1.version)
export class UpdateProductCategoryHttpController {
  constructor(private createProductCategory: UpdateProductCategoryService) {}
  @ApiOperation({ summary: 'create product category' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(routesV1.product.editProductCategory)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          // @ts-ignore
          const filename = `${Date.now()}-${file.originalname.replaceAll(' ', '-')}`; // Rename the file to include the timestamp
          callback(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, //5 mb limit
      fileFilter: (req, file, cb) => {
        if (!file) return cb(null, true); // ✅ allow requests without an image
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true); // Accept the file
        } else {
          cb(
            new BadRequestException(`Unsupported file type ${file.mimetype}`),
            false,
          ); // Reject the file
        }
      },
    }),
  )
  async edit(
    @UploadedFile() image: Express.Multer.File | undefined,
    @Body() body: UpdateProductCategoryRequestDto,
    @GetUser() user: User,
    @Param() params: GetProductsParamsDto,
  ) {
    const result = await this.createProductCategory.execute(
      body,
      params.id,
      image,
    );
    return result;
  }
}
