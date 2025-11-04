import { HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { PrismaProjectRepository } from '../../database/project.repository';
import {
  CreateExternalImageRequestDto,
  CreateExternalImageItemDto,
} from './create-external-image.request.dto';
import { CreateExternalImageDto } from './create-external-image.request.dto';

@Injectable()
export class CreateExternalProjectImagesService {
  constructor(private readonly projectRepo: PrismaProjectRepository) {}

  async execute(
    body: CreateExternalImageRequestDto,
    files: {
      beforeImages?: Express.Multer.File[];
      afterImages: Express.Multer.File[];
    },
  ): Promise<{
    statusCode: number;
    message: string;
    data: Array<ReturnType<PrismaProjectRepository['createExternalImage']>>;
  }> {
    const results: any = [];

    const totalAfter = files.afterImages?.length ?? 0;
    if (totalAfter === 0) {
      throw new BadRequestException('At least one afterImage is required');
    }

    // Iterate based on number of afterImages
    for (let i = 0; i < totalAfter; i++) {
      const before: Express.Multer.File | null =
        files.beforeImages?.[i] ?? null;
      const after: Express.Multer.File = files.afterImages[i];

      if (!after)
        throw new BadRequestException(`Missing afterImage for index ${i}`);

      // Construct DTO with correct type
      const dto: CreateExternalImageDto = {
        projectId: body.projectId,
        type: Array.isArray(body.images)
          ? (body.images[i]?.type ?? null)
          : (body.type ?? null),
      };

      const created = await this.projectRepo.createExternalImage(
        dto,
        after,
        before,
      );

      results.push(created);
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'External project images created successfully',
      data: results,
    };
  }
}
