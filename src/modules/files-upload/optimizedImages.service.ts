import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class OptimizedImagesService {
  private uploadsDir = 'uploads/products';
  private thumbnailDir = 'uploads/products/thumbnails';

  constructor() {
    // Ensure folders exist
    this.ensureFolder(this.uploadsDir);
    this.ensureFolder(this.thumbnailDir);
  }

  private ensureFolder(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async uploadFiles(
    files: Express.Multer.File[],
  ): Promise<
    { path: string; thumbnailPath: string; mimetype: string; size: number }[]
  > {
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const originalPath = path.join(this.uploadsDir, file.filename);
        const thumbnailFilename = `thumb-${file.filename}`;
        const thumbnailPath = path.join(this.thumbnailDir, thumbnailFilename);

        await sharp(file.path)
          // .resize(300, 300, { fit: sharp.fit.cover })
          .resize()
          .jpeg({ quality: 90 })
          .toFile(thumbnailPath);

        return {
          path: `${this.uploadsDir}/${file.filename}`,
          thumbnailPath: `${this.thumbnailDir}/${thumbnailFilename}`,
          mimetype: file.mimetype,
          size: file.size,
        };
      }),
    );

    return uploadResults;
  }
}
