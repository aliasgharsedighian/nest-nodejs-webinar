import {
  BadRequestException,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

// ✅ Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Common Multer storage config
const storage = diskStorage({
  destination: uploadDir,
  filename: (req, file, callback) => {
    const filename = `${Date.now()}-${file.originalname.replaceAll(' ', '-')}`;
    callback(null, filename);
  },
});

// ✅ Expanded allowed MIME types for all image formats
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/webp',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/heic',
  'image/heif',
];

// ✅ File filter validation
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(`Unsupported file type ${file.mimetype}`),
      false,
    );
  }
};

// ✅ Increase file size limit to 10 MB
const limits = { fileSize: 10 * 1024 * 1024 }; // 10MB

// ✅ Unified factory for all upload types
export function ImageUploadInterceptor(
  options:
    | { type: 'single'; fieldName: string }
    | { type: 'multiple'; fields: { name: string; maxCount: number }[] }
    | { type: 'array'; fieldName: string; maxCount: number },
) {
  switch (options.type) {
    case 'single':
      return applyDecorators(
        UseInterceptors(
          FileInterceptor(options.fieldName, {
            storage,
            fileFilter,
            limits,
          }),
        ),
      );

    case 'array':
      return applyDecorators(
        UseInterceptors(
          FilesInterceptor(options.fieldName, options.maxCount, {
            storage,
            fileFilter,
            limits,
          }),
        ),
      );

    case 'multiple':
      return applyDecorators(
        UseInterceptors(
          FileFieldsInterceptor(options.fields, {
            storage,
            fileFilter,
            limits,
          }),
        ),
      );

    default:
      throw new Error('Invalid ImageUploadInterceptor type');
  }
}
