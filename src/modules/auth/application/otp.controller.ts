import { Body, Controller, Post } from '@nestjs/common';
import { RequestOTPUseCase } from './request-otp.usecase';
import { VerifyOTPUseCase } from './verify-otp.usecase';
import { routesV1 } from 'src/config/app.routes';

@Controller(routesV1.version)
export class OtpController {
  constructor(
    private readonly requestOtp: RequestOTPUseCase,
    private readonly verifyOtp: VerifyOTPUseCase,
  ) {}

  @Post(routesV1.auth.requestOtp)
  async request(@Body('mobileNumber') mobileNumber: string) {
    const request = await this.requestOtp.execute(mobileNumber);
    return request;
  }

  @Post(routesV1.auth.verifyOtp)
  async verify(@Body() body: { userId: number; code: string }) {
    const token = await this.verifyOtp.execute(body.userId, body.code);
    return { accessToken: token };
  }
}
