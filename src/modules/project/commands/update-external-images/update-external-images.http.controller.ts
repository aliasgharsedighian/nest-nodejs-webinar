import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Put,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { UpdateExternalProjectImagesService } from './update-external-images.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { ImageUploadInterceptor } from 'src/libs/common/image-upload.interceptor';
import { GetUser } from 'src/libs/decorators';
import { User } from '@prisma/client';
import { UpdateExternalImageRequestDto } from './update-external-images.request.dto';
import { GetProjectsParamsDto } from '../../queries/find-single-project/find-single-project.request.dto';

@Controller(routesV1.version)
export class UpdateExternalProjectImagesHttpController {
  constructor(
    private readonly externalImagesService: UpdateExternalProjectImagesService,
  ) {}

  @ApiOperation({ summary: 'Update external project images' })
  @ApiResponse({ status: HttpStatus.CREATED, type: IdResponse })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(routesV1.project.externalImages.updateImages)
  @ImageUploadInterceptor({
    type: 'multiple',
    fields: [
      { name: 'beforeImages', maxCount: 10 },
      { name: 'afterImages', maxCount: 10 },
    ],
  })
  async updateExternalImages(
    @UploadedFiles()
    files: {
      beforeImages?: Express.Multer.File[];
      afterImages: Express.Multer.File[];
    },
    @GetUser() user: User,
    @Body() body: UpdateExternalImageRequestDto,
    @Param() params: GetProjectsParamsDto,
  ) {
    const result = await this.externalImagesService.execute(
      body,
      params.id,
      files,
      user,
    );

    return result;
  }
}
