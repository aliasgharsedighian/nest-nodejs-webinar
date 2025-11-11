import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { GetSupportRequestByIdService } from './find-single-support-request.service';
import { GetProjectsParamsDto } from 'src/modules/project/queries/find-single-project/find-single-project.request.dto';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
@Controller(routesV1.version)
export class FindSingleSupportRequestHttpController {
  constructor(private findRequestSupport: GetSupportRequestByIdService) {}

  @Get(routesV1.user.getSingleSupportRequest)
  async findSupportRequestById(@Param() params: GetProjectsParamsDto) {
    const result = await this.findRequestSupport.execute(params.id);

    return result;
  }
}
