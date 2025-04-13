import { Body, Controller, Post } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { SignInRequestDto } from './signin-user.request.dto';
import { SignInUserService } from './signin-user.service';

@Controller(routesV1.version)
export class SignInUserHttpController {
  constructor(private signinAuth: SignInUserService) {}

  @Post(routesV1.auth.signin)
  signin(@Body() body: SignInRequestDto) {
    return this.signinAuth.execute(body);
  }
}
