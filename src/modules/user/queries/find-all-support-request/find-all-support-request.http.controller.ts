import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { GetAllSupportRequestsService } from './find-all-support-request.service';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
@Controller(routesV1.version)
export class GetAllSupportRequestHttpController {
  constructor(private userService: GetAllSupportRequestsService) {}

  @Get(routesV1.user.getAllSupportRequests)
  async createSupportRequest(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.userService.execute(queryParams);

    return {
      statusCode: HttpStatus.OK,
      message: 'get all support requests successfully',
      data: result,
    };
  }
}
