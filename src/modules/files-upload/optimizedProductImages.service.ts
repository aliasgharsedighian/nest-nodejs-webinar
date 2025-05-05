import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class OptimizedImagesService {
  private uploadsDir = 'uploads/products';
  private thumbnailDir = 'uploads/products/thumbnails';
  private thumbnailCategoryDir = 'uploads/products/categories';

  constructor() {
    // Ensure folders exist
    this.ensureFolder(this.uploadsDir);
    this.ensureFolder(this.thumbnailDir);
    this.ensureFolder(this.thumbnailCategoryDir);
  }

  private ensureFolder(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  async uploadProductImages(
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

  async uploadProductCategoryImage(file: Express.Multer.File): Promise<{
    path: string;
    thumbnailPath: string;
    mimetype: string;
    size: number;
  }> {
    const thumbnailPath = path.join(
      this.thumbnailCategoryDir,
      `thumb-${file.filename}`,
    );
    await sharp(file.path).resize(300).toFile(thumbnailPath);

    return {
      path: `${this.uploadsDir}/${file.filename}`,
      thumbnailPath: `${thumbnailPath}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  async deleteProductImages(files: string[]) {
    const results: any = [];

    for (const file of files) {
      const filePath = path.join(
        process.cwd(),

        file,
      );

      try {
        await fs.promises.unlink(filePath);
        results.push({ file, status: 'deleted' });
      } catch (err) {
        results.push({ file, status: 'error', message: err.message });
      }
    }
    return results;
  }
}
