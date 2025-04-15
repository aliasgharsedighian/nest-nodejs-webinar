import { Injectable } from '@nestjs/common';
import { OTPService } from '../strategy/otp/otp.service';
import { OTPRepository } from '../database/otp.repository';
import { NotifierService } from './notifier.service';
import { PrismaService } from 'src/libs/db/prisma/prisma.service';

@Injectable()
export class RequestOTPUseCase {
  constructor(
    private readonly otpService: OTPService,
    private readonly otpRepo: OTPRepository,
    private readonly notifier: NotifierService, // Send SMS/Email
    private prisma: PrismaService,
  ) {}

  async execute(mobileNumber: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        phoneNumber: mobileNumber,
      },
    });

    if (user) {
      const otp = await this.otpService.generate(user.id);
      await this.otpRepo.save(otp);
      await this.notifier.sendOTP(mobileNumber, otp.code); // implement notifier
      return { message: 'OTP sent', userId: user.id };
    } else {
      const user = await this.prisma.user.create({
        data: {
          email: null,
          phoneNumber: mobileNumber,
          password: null,
          role: 'USER',
          profile: {
            create: {
              firstname: '',
              lastname: '',
            },
          },
        },
        select: {
          id: true,
          email: true,
          role: true,
          profile: true,
        },
      });
      const otp = await this.otpService.generate(user.id);
      await this.otpRepo.save(otp);
      await this.notifier.sendOTP(mobileNumber, otp.code); // implement notifier
      return { message: 'OTP sent', userId: user.id };
    }
  }
}
