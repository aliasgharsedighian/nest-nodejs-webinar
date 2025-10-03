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
import { UpdateProjectRequestDto } from './update-project.request.dto';
import { UpdateProjectService } from './update-project.service';
import { GetProjectsParamsDto } from '../../queries/find-single-project/find-single-project.request.dto';

@Controller(routesV1.version)
export class UpdateProjectHttpController {
  constructor(private updateProject: UpdateProjectService) {}

  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Project Not Found',
    type: '',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(routesV1.project.editProject)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 20 },
        { name: 'coverImage', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            // @ts-ignore
            const filename = `${Date.now()}-${file.originalname.replaceAll(' ', '-')}`;
            callback(null, filename);
          },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(
              new BadRequestException(`Unsupported file type ${file.mimetype}`),
              false,
            );
          }
        },
      },
    ),
  )
  async update(
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      coverImage: Express.Multer.File[];
    },
    @Body() body: UpdateProjectRequestDto,
    @GetUser() user: User,
    @Param() params: GetProjectsParamsDto,
  ) {
    // Cover image is optional for update, but you can enforce if needed
    const result = await this.updateProject.execute(
      body,
      params.id,
      files.coverImage?.[0],
      files.images,
      user,
    );
    return result;
  }
}
