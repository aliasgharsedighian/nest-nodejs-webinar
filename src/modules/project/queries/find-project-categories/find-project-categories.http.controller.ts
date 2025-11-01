import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { FindAllProjectCategoriesService } from './find-project-categories.service';

@Controller(routesV1.version)
export class FindAllProjectCategoriesHttpController {
  constructor(private findProject: FindAllProjectCategoriesService) {}
  @Get(routesV1.project.showProjectCategories)
  @ApiOperation({ summary: 'find all project categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findProjectCategries(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.findProject.execute(queryParams);

    return result;
  }
}
