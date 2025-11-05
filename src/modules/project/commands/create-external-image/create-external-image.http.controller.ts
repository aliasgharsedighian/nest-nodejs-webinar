import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
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
import { CreateExternalImageRequestDto } from './create-external-image.request.dto';
import { CreateExternalProjectImagesService } from './create-external-image.service';

@Controller(routesV1.version)
export class CreateExternalProjectImagesHttpController {
  constructor(
    private readonly externalImagesService: CreateExternalProjectImagesService,
  ) {}

  @ApiOperation({ summary: 'Create one or multiple external project images' })
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(routesV1.project.externalImages.createImages)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'beforeImages', maxCount: 10 },
        { name: 'afterImages', maxCount: 10 },
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
        limits: { fileSize: 5 * 1024 * 1024 },
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
      beforeImages?: Express.Multer.File[];
      afterImages: Express.Multer.File[];
    },
    @Body() body: CreateExternalImageRequestDto,
    @GetUser() user: User,
  ) {
    if (!files.afterImages || files.afterImages.length === 0) {
      throw new BadRequestException('At least one afterImage is required');
    }

    return this.externalImagesService.execute(body, files);
  }
}
