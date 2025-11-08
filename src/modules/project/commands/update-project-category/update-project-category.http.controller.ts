import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Put,
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
import { GetProjectsParamsDto } from '../../queries/find-single-project/find-single-project.request.dto';
import { UpdateProjectCategoryRequestDto } from './update-project-category.request.dto';
import { UpdateProjectCategoryService } from './update-project-category.service';
import { ImageUploadInterceptor } from 'src/libs/common/image-upload.interceptor';

@Controller(routesV1.version)
export class UpdateProjectCategoryHttpController {
  constructor(private createProjectCategory: UpdateProjectCategoryService) {}
  @ApiOperation({ summary: 'update project category' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(routesV1.project.editProjectCategory)
  @ImageUploadInterceptor({ type: 'single', fieldName: 'image' })
  async edit(
    @UploadedFile() image: Express.Multer.File | undefined,
    @Body() body: UpdateProjectCategoryRequestDto,
    @GetUser() user: User,
    @Param() params: GetProjectsParamsDto,
  ) {
    const result = await this.createProjectCategory.execute(
      body,
      params.id,
      image,
    );
    return result;
  }
}
