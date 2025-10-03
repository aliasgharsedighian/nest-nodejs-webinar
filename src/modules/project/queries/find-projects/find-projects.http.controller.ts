import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { ProjectsPaginatedResponseDto } from '../../dtos/projects.paginated.response.dto';
import { FindProjectsService } from './find-projects.service';

@Controller(routesV1.version)
export class FindAllProjectsHttpController {
  constructor(private findAllProjects: FindProjectsService) {}

  @Get(routesV1.project.getAllProjects)
  @ApiOperation({ summary: 'find all projects with paginate' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectsPaginatedResponseDto,
  })
  async findProducts(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.findAllProjects.execute(queryParams);

    return {
      statusCode: HttpStatus.OK,
      message: 'get all projects successfully',
      data: result,
    };
  }
}
