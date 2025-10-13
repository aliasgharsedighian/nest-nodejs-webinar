import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { ProjectsPaginatedResponseDto } from '../../dtos/projects.paginated.response.dto';
import { FindAllProjectsAdminService } from './find-all-projects-admin.service';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { GetProjectsParamsDto } from '../find-single-project/find-single-project.request.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
@Controller(routesV1.version)
export class FindAllAdminProjectsHttpController {
  constructor(private findAdminProjects: FindAllProjectsAdminService) {}

  @Get(routesV1.project.getAllAdminProjects)
  @ApiOperation({ summary: 'find all projects with paginate' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProjectsPaginatedResponseDto,
  })
  async findProjectsAdmin(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.findAdminProjects.findAll(queryParams);

    return {
      statusCode: HttpStatus.OK,
      message: 'get all projects successfully',
      data: result,
    };
  }

  @Get(routesV1.project.showAdminProject)
  async findProjectAdminById(@Param() params: GetProjectsParamsDto) {
    const result = await this.findAdminProjects.findOne(params.id);

    return result;
  }
}
