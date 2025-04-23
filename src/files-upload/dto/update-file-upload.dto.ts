import { PartialType } from '@nestjs/swagger';
import { UploadFileRequestDto } from './upload-files.request.dto';

export class UpdateFileUploadDto extends PartialType(UploadFileRequestDto) {}
