import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { diskStorage } from 'multer';
import { routesV1 } from 'src/config/app.routes';
import { GetUser } from 'src/libs/decorators';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { CreateExternalProjectImagesCategoryRequestDto } from './create-external-image-categories.request.dto';
import { CreateExternalProjectImagesCategoryService } from './create-external-image-categories.service';

@Controller(routesV1.version)
export class CreateExternalProjectImagesCategoryHttpController {
  constructor(
    private createProjectCategory: CreateExternalProjectImagesCategoryService,
  ) {}

  @ApiOperation({ summary: 'create external project image category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(routesV1.project.externalImages.createCategory)
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
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateExternalProjectImagesCategoryRequestDto,
    @GetUser() user: User,
  ) {
    if (!image) {
      throw new BadRequestException('Check your image(s)');
    }
    const result = await this.createProjectCategory.execute(body, image, user);
    return result;
  }
}
