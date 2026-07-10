import {
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';

  import type { IUserRepository } from '../interfaces/user-repository.interface';
  import { USER_REPOSITORY } from '../constants/injection-tokens';

  import { GenerateEmailOtpService } from './generate-email-otp.service';
  import { ResendOtpDto } from '../dto/resend-otp.dto';

  @Injectable()
  export class ResendOtpService {
    constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: IUserRepository,

      private readonly generateEmailOtpService: GenerateEmailOtpService,
    ) {}

    async resend(dto: ResendOtpDto): Promise<void> {
      const user = await this.userRepository.findByEmail(dto.email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.generateEmailOtpService.generate(
        dto.email,
        'VERIFY_EMAIL',
      );
    }
  }
