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
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          // @ts-ignore
          const filename = `${Date.now()}-${file.originalname.replaceAll(' ', '-')}`; // Rename the file to include the timestamp
          callback(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
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
