import {
    Inject,
    Injectable,
    BadRequestException,
  } from '@nestjs/common';

  import type { IOtpRepository } from '../interfaces/otp-repository.interface';
  import type { IUserRepository } from '../interfaces/user-repository.interface';

  import {
    OTP_REPOSITORY,
    USER_REPOSITORY,
  } from '../constants/injection-tokens';

  import { VerifyEmailDto } from '../dto/verify-email.dto';

  @Injectable()
  export class VerifyEmailService {
    constructor(
      @Inject(OTP_REPOSITORY)
      private readonly otpRepository: IOtpRepository,

      @Inject(USER_REPOSITORY)
      private readonly userRepository: IUserRepository,
    ) {}

    async verify(dto: VerifyEmailDto): Promise<void> {
      const otp = await this.otpRepository.findValidOtp(
        dto.email,
        dto.otp,
        'VERIFY_EMAIL',
      );

      if (!otp) {
        throw new BadRequestException('Invalid or expired OTP');
      }

      await this.userRepository.verifyEmail(dto.email);

      await this.otpRepository.delete(dto.email);
    }
  }
