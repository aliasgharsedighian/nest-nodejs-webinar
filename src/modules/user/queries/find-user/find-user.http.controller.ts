import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { routesV1 } from 'src/config/app.routes';

@Controller(routesV1.version)
export class FindUserHttpController {
  constructor(private readonly queryBus: QueryBus) {}

  // @Get(routesV1.auth.userInfo)
  // async findUser
}
