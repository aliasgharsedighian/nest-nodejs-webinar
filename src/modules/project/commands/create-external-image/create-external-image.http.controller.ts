import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { diskStorage } from 'multer';
import { routesV1 } from 'src/config/app.routes';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { GetUser } from 'src/libs/decorators';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import * as path from 'path';
import * as fs from 'fs';
import { CreateExternalImageDto } from './create-external-image.request.dto';
import { CreateExternalProjectImagesService } from './create-external-image.service';

@Controller(routesV1.version)
export class CreateExternalProjectImagesHttpController {
  constructor(
    private externalImagesService: CreateExternalProjectImagesService,
  ) {}

  @ApiOperation({ summary: 'Create a external images for project by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Project Already have external images',
    type: '',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(routesV1.project.createExternalProjectImages)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'beforeImage', maxCount: 1 },
        { name: 'afterImage', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const sanitized = file.originalname.replace(/\s+/g, '-');
            const filename = `${Date.now()}-${sanitized}`;
            callback(null, filename);
          },
        }),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
          if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
          else
            cb(
              new BadRequestException(`Unsupported file type ${file.mimetype}`),
              false,
            );
        },
      },
    ),
  )
  async createExternalImages(
    @UploadedFiles()
    files: {
      beforeImage?: Express.Multer.File[];
      afterImage?: Express.Multer.File[];
    },
    @Body() body: CreateExternalImageDto,
    @GetUser() user: User,
  ) {
    if (!files.afterImage?.[0]) {
      throw new BadRequestException('After image is required');
    }

    const before = files.beforeImage?.[0] ?? null;
    const after = files.afterImage?.[0];

    return this.externalImagesService.execute(before, after, body);
  }
}
