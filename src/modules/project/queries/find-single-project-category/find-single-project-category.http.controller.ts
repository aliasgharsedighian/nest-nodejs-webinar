import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindProjectCategoryService } from './find-single-project-category.service';
import { GetProjectCategoryParamsDto } from './find-single-project-category.request.dto';

@Controller(routesV1.version)
export class FindProjectCategoryByIdHttpController {
  constructor(private findProject: FindProjectCategoryService) {}
  @Get(routesV1.project.showProjectCategory)
  @ApiOperation({ summary: 'find single project category with id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findProducCategorytById(@Param() params: GetProjectCategoryParamsDto) {
    const result = await this.findProject.execute(params.id);

    return result;
  }
}
