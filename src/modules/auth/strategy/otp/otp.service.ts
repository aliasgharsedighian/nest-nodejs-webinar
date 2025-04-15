import { PrismaService } from 'src/libs/db/prisma/prisma.service';
import { OTP } from '../../domain/entities/otp.entity';

export class OTPService {
  constructor() {}

  async generate(mobileNumber: string, user: any): Promise<OTP> {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
    return new OTP(user.id, code, expiresAt);
  }

  verify(otp: OTP, inputCode: string): boolean {
    return !otp.isExpired() && otp.matches(inputCode);
  }
}
