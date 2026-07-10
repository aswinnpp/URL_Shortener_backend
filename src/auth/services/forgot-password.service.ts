import {
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';

  import type { IUserRepository } from '../interfaces/user-repository.interface';
  import { USER_REPOSITORY } from '../constants/injection-tokens';

  import { ForgotPasswordDto } from '../dto/forgot-password.dto';
  import { GenerateEmailOtpService } from './generate-email-otp.service';

  @Injectable()
  export class ForgotPasswordService {
    constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: IUserRepository,

      private readonly generateEmailOtpService: GenerateEmailOtpService,
    ) {}

    async sendResetOtp(dto: ForgotPasswordDto): Promise<void> {
      const user = await this.userRepository.findByEmail(dto.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.generateEmailOtpService.generate(
        dto.email,
        'RESET_PASSWORD',
      );
    }
  }
