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
