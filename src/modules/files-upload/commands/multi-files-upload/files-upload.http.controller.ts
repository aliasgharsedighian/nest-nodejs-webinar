import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './files-upload.service';
import { diskStorage } from 'multer';
import { UploadFileRequestDto } from './files-upload.request.dto';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { ImageUploadInterceptor } from 'src/libs/common/image-upload.interceptor';

@Controller('api/v1/file-upload')
@UseGuards(JwtGuard, RolesGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload-files')
  @Roles('ADMIN')
  @ImageUploadInterceptor({ type: 'array', fieldName: 'files', maxCount: 10 })
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files) {
      throw new BadRequestException('Check your file(s)');
    }
    return this.fileUploadService.handleFilesUpload(files);
  }
}
