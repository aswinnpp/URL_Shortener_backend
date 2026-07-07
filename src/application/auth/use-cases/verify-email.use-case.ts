import {
    Inject,
    Injectable,
    BadRequestException,
  } from '@nestjs/common';
  
  import type { IOtpRepository } from '../../../domain/repositories/otp.repository';
  import type { IUserRepository } from '../../../domain/repositories/user.repository';
  
  import {
    OTP_REPOSITORY,
    USER_REPOSITORY,
  } from '../../../domain/repositories/token';
  
  import { VerifyEmailDto } from '../dto/verify-email.dto';
  
  @Injectable()
  export class VerifyEmailUseCase {
    constructor(
      @Inject(OTP_REPOSITORY)
      private readonly otpRepository: IOtpRepository,
  
      @Inject(USER_REPOSITORY)
      private readonly userRepository: IUserRepository,
    ) {}
  
    async execute(dto: VerifyEmailDto): Promise<void> {
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