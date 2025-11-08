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
import { ImageUploadInterceptor } from 'src/libs/common/image-upload.interceptor';

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
  @ImageUploadInterceptor({
    type: 'multiple',
    fields: [
      { name: 'beforeImages', maxCount: 10 },
      { name: 'afterImages', maxCount: 10 },
    ],
  })
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
