import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { OptimizedImagesService } from 'src/modules/files-upload/optimizedProductImages.service';

@Injectable()
export class PrismaProjectRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: OptimizedImagesService,
  ) {}

  async create() {
    try {
    } catch (error) {
      throw error;
    }
  }

  async findAllPaginate() {
    try {
    } catch (error) {
      throw error;
    }
  }

  //title is a unique item
  async findByTitle() {
    try {
    } catch (error) {
      throw error;
    }
  }

  async updateByTitle() {
    try {
    } catch (error) {
      throw error;
    }
  }

  async removeByTitle() {
    try {
    } catch (error) {
      throw error;
    }
  }
}
