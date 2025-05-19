import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { diskStorage } from 'multer';
import { routesV1 } from 'src/config/app.routes';
import { IdResponse } from 'src/libs/api/id.response.dto';
import { GetUser } from 'src/libs/decorators';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { CreateProjectRequestDto } from './create-project.request.dto';
import { CreateProjectService } from './create-project.service';

@Controller(routesV1.version)
export class CreateProjectHttpController {
  constructor(private createProject: CreateProjectService) {}

  @ApiOperation({ summary: 'Create a project' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Project Already Exist',
    type: '',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(routesV1.project.createProject)
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
      },
    ),
  )
  async create(
    @UploadedFiles()
    files: {
      images: Express.Multer.File[];
      coverImage: Express.Multer.File[];
    },
    @Body() body: CreateProjectRequestDto,
    @GetUser() user: User,
  ) {
    if (!files.coverImage[0]) {
      throw new BadRequestException('Check your image(s)');
    }
    const result = await this.createProject.execute(
      body,
      files.coverImage[0],
      files.images,
      user,
    );

    return result;
  }
}
