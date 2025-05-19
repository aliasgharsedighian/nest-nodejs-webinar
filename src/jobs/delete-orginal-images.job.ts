import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class DeleteOriginalsJob {
  private readonly logger = new Logger(DeleteOriginalsJob.name);

  private readonly uploadsDir = path.resolve('uploads');
  private readonly thumbnailsDir = path.resolve('uploads/products');
  private readonly ArticlesDir = path.resolve('uploads/articles');
  private readonly ProjectsDir = path.resolve('uploads/projects');

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.run();
  }

  async run() {
    this.logger.log('Starting cleanup of original images...');
    const files = await fs.readdir(this.uploadsDir);

    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(this.uploadsDir, file);

      // Skip thumbnails
      if (filePath.startsWith(this.thumbnailsDir)) continue;

      const stat = await fs.stat(filePath);
      const ageMs = now - stat.mtimeMs;

      // If older than 24 hours
      if (ageMs > 24 * 60 * 60 * 1000) {
        try {
          await fs.unlink(filePath);
          this.logger.log(`Deleted: ${filePath}`);
        } catch (err) {
          this.logger.error(`Failed to delete ${filePath}: ${err.message}`);
        }
      }
    }

    this.logger.log('Finished cleanup of original images.');
  }
}
