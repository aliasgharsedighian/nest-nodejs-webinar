import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { FindAllExternalImageProjectCategoriesService } from './find-external-image-categories.service';

@Controller(routesV1.version)
export class FindAllExternalImageProjectCategoriesHttpController {
  constructor(
    private findProject: FindAllExternalImageProjectCategoriesService,
  ) {}
  @Get(routesV1.project.externalImages.showAllCategories)
  @ApiOperation({ summary: 'find all external project image categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findProjectCategries(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.findProject.execute(queryParams);

    return result;
  }
}
