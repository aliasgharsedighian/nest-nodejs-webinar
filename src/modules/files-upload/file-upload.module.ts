import { Module } from '@nestjs/common';
import { FileUploadController } from './commands/multi-files-upload/files-upload.http.controller';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadService } from './commands/multi-files-upload/files-upload.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
