import {
    BadRequestException,
    Inject,
    Injectable,
  } from '@nestjs/common';
  
  import type { IOtpRepository } from '../../../domain/repositories/otp.repository';
  import type { IUserRepository } from '../../../domain/repositories/user.repository';
  
  import {
    OTP_REPOSITORY,
    USER_REPOSITORY,
  } from '../../../domain/repositories/token';
  
  import type { IPasswordHasher } from '../interfaces/password-hasher.interface';
  
  import { ResetPasswordDto } from '../dto/reset-password.dto';
  
  @Injectable()
  export class ResetPasswordUseCase {
    constructor(
      @Inject(OTP_REPOSITORY)
      private readonly otpRepository: IOtpRepository,
  
      @Inject(USER_REPOSITORY)
      private readonly userRepository: IUserRepository,
  
      @Inject('PASSWORD_HASHER')
      private readonly passwordHasher: IPasswordHasher,
    ) {}
  
    async execute(dto: ResetPasswordDto): Promise<void> {
      const otp = await this.otpRepository.findValidOtp(
        dto.email,
        dto.otp,
        'RESET_PASSWORD',
      );
  
      if (!otp) {
        throw new BadRequestException(
          'Invalid or expired OTP',
        );
      }
  
      const hashedPassword =
        await this.passwordHasher.hash(
          dto.newPassword,
        );
  
      await this.userRepository.updatePassword(
        dto.email,
        hashedPassword,
      );
  
      await this.otpRepository.delete(dto.email);
    }
  }