import {
  Controller,
  Put,
  UseGuards,
  Param,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { GetUserParamsDto } from '../../dtos/get-user.request.dto';
import { EditRequestService } from './update-request-support.service';
import { EditUserRequestSupportRequestDto } from './update-request-support.request.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller(routesV1.version)
export class UpdateUserRequestSupportHttpController {
  constructor(private editRequest: EditRequestService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(routesV1.user.updateUserRequest)
  @UseInterceptors(AnyFilesInterceptor())
  async edit(
    @Body() body: EditUserRequestSupportRequestDto,
    @Param() params: GetUserParamsDto,
  ) {
    const result = await this.editRequest.execute(body, params.id);

    return result;
  }
}
