import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadFileRequestDto } from './files-upload.request.dto';

@Injectable()
export class FileUploadService {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']; // allowed types
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

  handleFilesUpload(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    for (const file of files) {
      this.validateFile(file);
    }

    // After validation passed
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Files uploaded successfully',
      data: {
        files: files.map((file) => file.path),
      },
    };
  }

  private validateFile(file: Express.Multer.File) {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type: ${file.mimetype}. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File ${file.originalname} is too large. Max size is ${this.maxFileSize / (1024 * 1024)}MB.`,
      );
    }
  }
}
