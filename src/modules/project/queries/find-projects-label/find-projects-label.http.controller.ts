import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindProjectLabelImageService } from './find-projects-label.service';
import { routesV1 } from 'src/config/app.routes';

@Controller(routesV1.version)
export class FindProjectLabelImagesHttpController {
  constructor(private readonly service: FindProjectLabelImageService) {}

  @Get(routesV1.project.projectLabelImagesById)
  async getImages(
    @Param('projectId') projectId: string,
    @Query('label') label?: string,
  ) {
    return this.service.getProjectImages(Number(projectId), label);
  }

  @Get(routesV1.project.projectLabelImagesByLabel)
  async getImagesByLabel(@Param('label') label: string) {
    return this.service.getImagesByLabel(label);
  }
}
