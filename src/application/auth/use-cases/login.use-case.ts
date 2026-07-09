import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { IUserRepository } from '../../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../domain/repositories/token';

import { LoginRequestDto } from '../dto/login.dto';
import type { IPasswordHasher } from '../interfaces/password-hasher.interface';
import { GenerateLoginResponseUseCase } from './generate-login-response.use-case';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject('PASSWORD_HASHER')
    private readonly passwordHasher: IPasswordHasher,

    private readonly generateLoginResponseUseCase: GenerateLoginResponseUseCase,
  ) {}

  async execute(dto: LoginRequestDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'This account uses Google Sign-In. Please continue with Google.',
      );
    }

    const isMatch = await this.passwordHasher.compare(
      dto.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }

    return this.generateLoginResponseUseCase.execute(user);
  }
}