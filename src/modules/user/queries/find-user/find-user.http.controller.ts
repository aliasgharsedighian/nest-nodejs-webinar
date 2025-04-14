import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { routesV1 } from 'src/config/app.routes';
import { GetUser } from 'src/libs/decorators';
import { JwtGuard } from 'src/libs/guard';

@Controller(routesV1.version)
export class FindUserHttpController {
  constructor() {}
  @UseGuards(JwtGuard)
  @Get(routesV1.auth.userInfo)
  findUser(@GetUser() user: User) {
    return user;
  }
}
