import {
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import type { IUserRepository } from '../../../domain/repositories/user.repository';
  import { USER_REPOSITORY } from '../../../domain/repositories/token';
  
  import { GenerateEmailOtpUseCase } from './generate-email-otp.use-case';
  import { ResendOtpDto } from '../dto/resend-otp.dto';
  
  @Injectable()
  export class ResendOtpUseCase {
    constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: IUserRepository,
  
      private readonly generateEmailOtpUseCase: GenerateEmailOtpUseCase,
    ) {}
  
    async execute(dto: ResendOtpDto): Promise<void> {
      const user = await this.userRepository.findByEmail(dto.email);
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      await this.generateEmailOtpUseCase.execute(
        dto.email,
        'VERIFY_EMAIL',
      );
    }
  }