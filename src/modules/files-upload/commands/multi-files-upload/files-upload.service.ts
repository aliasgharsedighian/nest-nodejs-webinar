import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadFileRequestDto } from './files-upload.request.dto';
import { OptimizedImagesService } from '../../optimizedProductImages.service';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';

@Injectable()
export class FileUploadService {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']; // allowed types
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB in bytes

  constructor(
    private readonly fileService: OptimizedImagesService,
    private readonly prisma: PrismaService,
  ) {}

  async handleFilesUpload(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded.');
    }

    for (const file of files) {
      this.validateFile(file);
    }

    const uploadedFiles = await this.fileService.uploadFilesImages(files);
    const uploadFileRecords = await Promise.all(
      uploadedFiles.map((image) =>
        this.prisma.uploadFile.create({
          data: {
            path: `${process.env.DOMAIN_ADDRESS}${image.thumbnailPath}`,
            mimetype: image.mimetype,
            size: image.size,
          },
        }),
      ),
    );

    // After validation passed
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Files uploaded successfully',
      data: {
        files: uploadFileRecords.map((file) => {
          return {
            id: file.id,
            path: file.path,
          };
        }),
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
