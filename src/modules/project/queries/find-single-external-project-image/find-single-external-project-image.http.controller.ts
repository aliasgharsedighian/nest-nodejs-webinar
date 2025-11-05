import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetProjectCategoryParamsDto } from '../find-single-project-category/find-single-project-category.request.dto';
import { FindExternalProjectImageCategoryService } from './find-single-external-project-image.service';

@Controller(routesV1.version)
export class FindExternalProjectImageCategoryByIdHttpController {
  constructor(private findProject: FindExternalProjectImageCategoryService) {}
  @Get(routesV1.project.externalImages.showCategoryById)
  @ApiOperation({ summary: 'find single project category with id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findById(@Param() params: GetProjectCategoryParamsDto) {
    const result = await this.findProject.execute(params.id);

    return result;
  }
}
