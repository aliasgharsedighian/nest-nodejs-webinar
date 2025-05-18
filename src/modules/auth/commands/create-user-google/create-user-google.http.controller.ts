import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { routesV1 } from 'src/config/app.routes';
import { CreateGoogleUserService } from './create-user-google.service';

@Controller()
export class GoogleAuthController {
  constructor(private googleUser: CreateGoogleUserService) {}

  @Get(routesV1.googleAuth.googleAuth)
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirect to Google login
  }

  @Get(routesV1.googleAuth.googleRedirectUrl)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const result = await this.googleUser.execute(req.user);

    return result;
  }
}
