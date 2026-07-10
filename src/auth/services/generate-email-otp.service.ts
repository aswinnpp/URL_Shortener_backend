import { Inject, Injectable } from '@nestjs/common';

import { Otp } from '../../entities/otp.entity';
import type { IOtpRepository } from '../interfaces/otp-repository.interface';
import { OTP_REPOSITORY } from '../constants/injection-tokens';
import type { IEmailService } from '../interfaces/email.service.interface';
import { EMAIL_SERVICE } from '../interfaces/email.service.interface';

@Injectable()
export class GenerateEmailOtpService {
  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otpRepository: IOtpRepository,

    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async generate(
    email: string,
    purpose: 'VERIFY_EMAIL' | 'RESET_PASSWORD',
  ): Promise<string> {
    const otp = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await this.otpRepository.delete(email);

    await this.otpRepository.create(
      new Otp(
        null,
        email,
        otp,
        purpose,
        new Date(Date.now() + 1 * 60 * 1000),
        false,
      ),
    );

    if (purpose === 'VERIFY_EMAIL') {
      await this.emailService.sendVerificationOtp(
        email,
        otp,
      );
    } else {
      await this.emailService.sendResetPasswordOtp(
        email,
        otp,
      );
    }

    return otp;
  }
}
