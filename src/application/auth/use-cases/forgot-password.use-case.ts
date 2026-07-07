import {
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import type { IUserRepository } from '../../../domain/repositories/user.repository';
  import { USER_REPOSITORY } from '../../../domain/repositories/token';
  
  import { ForgotPasswordDto } from '../dto/forgot-password.dto';
  import { GenerateEmailOtpUseCase } from './generate-email-otp.use-case';
  
  @Injectable()
  export class ForgotPasswordUseCase {
    constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: IUserRepository,
  
      private readonly generateEmailOtpUseCase: GenerateEmailOtpUseCase,
    ) {}
  
    async execute(dto: ForgotPasswordDto): Promise<void> {
      const user = await this.userRepository.findByEmail(dto.email);
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      await this.generateEmailOtpUseCase.execute(
        dto.email,
        'RESET_PASSWORD',
      );
    }
  }