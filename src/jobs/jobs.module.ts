import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DeleteOriginalsJob } from './delete-orginal-images.job';
import { FileUploadModule } from 'src/modules/files-upload/file-upload.module';

@Module({
  imports: [ScheduleModule.forRoot(), FileUploadModule],
  providers: [DeleteOriginalsJob],
  exports: [DeleteOriginalsJob],
})
export class JobsModule {}
