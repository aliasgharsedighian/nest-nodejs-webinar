import { Module } from '@nestjs/common';
import { FileUploadController } from './commands/multi-files-upload/files-upload.http.controller';
import { FileUploadService } from './commands/multi-files-upload/files-upload.service';
import { OptimizedImagesService } from './optimizedProductImages.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, OptimizedImagesService],
  exports: [OptimizedImagesService],
})
export class FileUploadModule {}
