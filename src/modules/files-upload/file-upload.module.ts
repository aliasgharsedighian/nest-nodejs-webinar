import { Module } from '@nestjs/common';
import { FileUploadController } from './commands/multi-files-upload/files-upload.http.controller';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadService } from './commands/multi-files-upload/files-upload.service';
import { OptimizedImagesService } from './optimizedImages.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, OptimizedImagesService],
  exports: [OptimizedImagesService],
})
export class FileUploadModule {}
