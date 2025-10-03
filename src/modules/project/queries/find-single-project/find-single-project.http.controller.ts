import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindProjectService } from './find-single-project.service';
import { GetProjectsParamsDto } from './find-single-project.request.dto';

@Controller(routesV1.version)
export class FindProjectByIdHttpController {
  constructor(private findProduct: FindProjectService) {}
  @Get(routesV1.project.showProject)
  @ApiOperation({ summary: 'find single project with id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findProductById(@Param() params: GetProjectsParamsDto) {
    const result = await this.findProduct.execute(params.id);

    return result;
  }
}
