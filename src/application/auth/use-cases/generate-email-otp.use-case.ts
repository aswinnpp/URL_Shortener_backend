import { Inject, Injectable } from '@nestjs/common';

import { Otp } from '../../../domain/entities/otp.entity';
import type { IOtpRepository } from '../../../domain/repositories/otp.repository';
import { OTP_REPOSITORY } from '../../../domain/repositories/token';
import type{ IEmailService } from '../interfaces/email.service.interface';
import { EMAIL_SERVICE } from '../interfaces/email.service.interface';

@Injectable()
export class GenerateEmailOtpUseCase {
  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otpRepository: IOtpRepository,
  
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(
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
        new Date(Date.now() + 5 * 60 * 1000),
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