import { Body, Controller, Post } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { CreateSupportRequestService } from './create-support-request.service';
import { CreateSupportRequestDto } from './create-support-request.request.dto';

@Controller(routesV1.version)
export class CreateSupportRequestHttpController {
  constructor(private userService: CreateSupportRequestService) {}

  @Post(routesV1.user.createSupportRequest)
  async createSupportRequest(@Body() dto: CreateSupportRequestDto) {
    const result = await this.userService.execute(dto);

    return result;
  }
}
