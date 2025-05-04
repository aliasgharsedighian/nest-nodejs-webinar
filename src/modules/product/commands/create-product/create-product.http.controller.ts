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
  async create(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() body: CreateProductRequestDto,
    @GetUser() user: User,
  ) {
    const result = await this.createProduct.execute(body, images, user);

    return result;
  }
}
